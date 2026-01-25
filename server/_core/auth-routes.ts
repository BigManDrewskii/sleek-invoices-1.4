import type { Express } from "express";
import { auth } from "./better-auth";
import { toNodeHandler } from "better-auth/node";

export async function registerAuthRoutes(app: Express) {
  // Set trust proxy BEFORE auth routes (required for Vercel)
  app.set("trust proxy", true);

  // Register Better Auth handler using official Node.js adapter
  // This handles ALL auth endpoints automatically:
  // - /api/auth/signin
  // - /api/auth/callback/:provider
  // - /api/auth/signout
  // - /api/auth/session
  // - /api/auth/providers
  const authHandler = toNodeHandler(auth);

  // Use wildcard path for all auth routes
  app.use("/api/auth/*", authHandler);
}
