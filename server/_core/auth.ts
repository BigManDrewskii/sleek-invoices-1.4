import type { ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import GitHub from "@auth/express/providers/github";

export const authConfig: ExpressAuthConfig = {
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
  basePath: "/api/auth", // All auth endpoints are under /api/auth/*
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user && account) {
        token.sub = user.id?.toString() || "";
        token.provider = account.provider;
      }
      return token;
    },
  },
};

// Log warning if no providers configured
if (!process.env.AUTH_GOOGLE_ID && !process.env.AUTH_GITHUB_ID) {
  console.warn(
    "[Auth] No OAuth providers configured. Users will not be able to sign in."
  );
  console.warn(
    '[Auth] Set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET or AUTH_GITHUB_ID/AUTH_GITHUB_SECRET environment variables'
  );
}
