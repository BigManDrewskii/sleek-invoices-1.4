import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { users, accounts, sessions } from "../../drizzle/schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDb, {
    provider: "mysql",
    usePlural: true,
    schema: {
      user: users,
      session: sessions,
      account: accounts,
    },
  }),
  socialProviders: {
    ...(process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET && {
        google: {
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          enabled: true,
        },
      }),
    ...(process.env.AUTH_GITHUB_ID &&
      process.env.AUTH_GITHUB_SECRET && {
        github: {
          clientId: process.env.AUTH_GITHUB_ID!,
          clientSecret: process.env.AUTH_GITHUB_SECRET!,
          enabled: true,
        },
      }),
  },
  secret: process.env.AUTH_SECRET!,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.AUTH_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  trustHost: true,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    sessionCookieExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  },
});
