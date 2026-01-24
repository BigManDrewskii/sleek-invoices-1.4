import type { AuthConfig } from "@auth/core";
import { Auth } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { getDb } from "../db/connection";
import { users, accounts, sessions } from "../../drizzle/schema";

export async function authHandler(request: Request) {
  const db = await getDb();

  // Validate database connection
  if (!db) {
    throw new Error("Database connection failed");
  }

  // Validate required AUTH_SECRET
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required");
  }

  // Build providers array based on available credentials
  const providers = [];

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      })
    );
  }

  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      })
    );
  }

  // Warn if no providers configured
  if (providers.length === 0) {
    console.warn(
      "[Auth] No OAuth providers configured. Users will not be able to sign in."
    );
    console.warn(
      '[Auth] Set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET or AUTH_GITHUB_ID/AUTH_GITHUB_SECRET environment variables'
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  return Auth(request, {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
    }),
    providers,
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Critical for Vercel/serverless environments
    session: {
      strategy: "jwt",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
      async jwt({ token, user, account }) {
        if (user && account) {
          token.sub = user.id?.toString() || "";
          token.provider = account.provider;
        }
        return token;
      },
    },
  });
}
