import type { ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import GitHub from "@auth/express/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "../db/connection.js";
import { users, accounts, sessions } from "../../drizzle/schema.js";

// Lazy database initialization for serverless compatibility
let _db: Awaited<ReturnType<typeof getDb>> | null = null;

async function getAuthDb() {
  if (!_db) {
    _db = await getDb();
  }
  return _db;
}

// Export async factory function instead of static config
export async function createAuthConfig(): Promise<ExpressAuthConfig> {
  const db = await getAuthDb();

  if (!db) {
    throw new Error("Database not available for auth configuration");
  }

  return {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
    }),
    providers: [
      ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
        ? [Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          })]
        : []),
      ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
        ? [GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          })]
        : []),
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Critical for Vercel/serverless environments
    // Note: basePath is NOT set here because Express already handles the /api/auth/* prefix
    // When using app.use("/api/auth/*", ExpressAuth(authConfig)), Express strips the prefix
    // and @auth/express receives root-level paths like /signin, /callback/google, etc.
    session: {
      strategy: "database", // CHANGED from "jwt" to "database" for persistent sessions
      maxAge: 365 * 24 * 60 * 60, // 1 year
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      async session({ session, user }: any) {
        // CHANGED: Now receives 'user' from database instead of 'token' from JWT
        if (session.user && user.id) {
          session.user.id = user.id.toString();
        }
        return session;
      },
    },
  };
}

// REMOVED: Deprecated top-level await export (caused serverless compatibility issues)
// use createAuthConfig() async function instead (called in auth-routes.ts)

// Log warning if no providers configured
if (!process.env.AUTH_GOOGLE_ID && !process.env.AUTH_GITHUB_ID) {
  console.warn(
    "[Auth] No OAuth providers configured. Users will not be able to sign in."
  );
  console.warn(
    '[Auth] Set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET or AUTH_GITHUB_ID/AUTH_GITHUB_SECRET environment variables'
  );
}
