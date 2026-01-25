import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getAuthDb } from "./db";
import { users, accounts, sessions } from "../../shared/schema/auth";

export const auth = betterAuth({
  database: {
    provider: drizzleAdapter(getAuthDb, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccounts: false,
    },
    github: {
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccounts: false,
    },
  },
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
  advanced: {
    generateId: true,
    sessionCookieExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  },
});
