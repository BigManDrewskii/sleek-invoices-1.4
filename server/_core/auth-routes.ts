import type { Express } from "express";
import { ExpressAuth } from "@auth/express";
import { authConfig } from "./auth";

export function registerAuthRoutes(app: Express) {
  // Set trust proxy BEFORE auth routes (required for Vercel)
  app.set("trust proxy", true);

  // Register @auth/express middleware
  // Handles ALL auth endpoints automatically:
  // - /api/auth/signin
  // - /api/auth/callback/:provider
  // - /api/auth/signout
  // - /api/auth/session
  // - /api/auth/providers
  // - /api/auth/csrf-token
  app.use("/api/auth/*", ExpressAuth(authConfig));
}
