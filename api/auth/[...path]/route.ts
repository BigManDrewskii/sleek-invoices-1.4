// Vercel serverless function for OAuth routes
// This bypasses the Express app and directly handles OAuth using Next.js API routes

import { Google, GitHub } from "@auth/express/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getAuthDb } from "../server/_core/db";
import { users, accounts, sessions } from "../shared/schema/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = request.url.split("/api/auth/")[1]?.split("?")[0];

  console.log("[Auth-OAuth] Request path:", path);

  // Handle different auth endpoints
  if (path === "providers") {
    const db = await getAuthDb();

    if (!db) {
      return new Response(JSON.stringify({ error: "Database not available" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const config = {
      providers: [
        ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
          ? [
              Google({
                clientId: process.env.AUTH_GOOGLE_ID,
                clientSecret: process.env.AUTH_GOOGLE_SECRET,
              }),
            ]
          : []),
        ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
          ? [
              GitHub({
                clientId: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
              }),
            ]
          : []),
      ],
      secret: process.env.AUTH_SECRET,
      trustHost: true,
      adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
      }),
    };

    // Generate providers response manually
    const providers = {};

    if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
      providers.google = {
        id: "google",
        name: "Google",
        type: "oidc",
        signinUrl: `${request.url.split("/api/auth/providers")[0]}/api/auth/signin/google`,
        callbackUrl: `${request.url.split("/api/auth/providers")[0]}/api/auth/callback/google`,
      };
    }

    if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
      providers.github = {
        id: "github",
        name: "GitHub",
        type: "oauth",
        signinUrl: `${request.url.split("/api/auth/providers")[0]}/api/auth/signin/github`,
        callbackUrl: `${request.url.split("/api/auth/providers")[0]}/api/auth/callback/github`,
      };
    }

    return new Response(JSON.stringify(providers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (path?.startsWith("signin/")) {
    const provider = path.split("signin/")[1];
    const baseUrl = request.url.split("?")[0];
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    console.log("[Auth-OAuth] Signin request:", { provider, callbackUrl });

    if (provider === "google") {
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.AUTH_GOOGLE_ID}&` +
        `redirect_uri=${encodeURIComponent(`${baseUrl.split("/api/auth/signin/google")[0]}/api/auth/callback/google`)}&` +
        `response_type=code&` +
        `scope=email%20profile&` +
        `state=${encodeURIComponent(JSON.stringify({ callbackUrl }))}`;

      return Response.redirect(googleAuthUrl, 302);
    }

    if (provider === "github") {
      const githubAuthUrl =
        `https://github.com/login/oauth/authorize?` +
        `client_id=${process.env.AUTH_GITHUB_ID}&` +
        `redirect_uri=${encodeURIComponent(`${baseUrl.split("/api/auth/signin/github")[0]}/api/auth/callback/github`)}&` +
        `scope=user%3Aemail&` +
        `state=${encodeURIComponent(JSON.stringify({ callbackUrl }))}`;

      return Response.redirect(githubAuthUrl, 302);
    }
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
