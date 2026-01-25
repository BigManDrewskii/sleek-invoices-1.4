import type { Express } from "express";
import { ExpressAuth } from "@auth/express";
import { createAuthConfig } from "./auth";

export async function registerAuthRoutes(app: Express) {
  // Set trust proxy BEFORE auth routes (required for Vercel)
  app.set("trust proxy", true);

  // Await async auth config (database connection required)
  const authConfig = await createAuthConfig();

  // Register @auth/express middleware
  // This handles ALL auth endpoints automatically:
  // - /api/auth/signin
  // - /api/auth/callback/:provider
  // - /api/auth/signout
  // - /api/auth/session
  // - /api/auth/providers
  // - /api/auth/csrf-token
  app.use("/api/auth/*", ExpressAuth(authConfig));
}
