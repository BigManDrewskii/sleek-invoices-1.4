import type { Express } from "express";
import { auth } from "./better-auth";
import { toNodeHandler } from "better-auth/node";

export async function registerAuthRoutes(app: Express) {
  // Set trust proxy BEFORE auth routes (required for Vercel)
  // Trust 1 proxy layer (Vercel or typical load balancer setup)
  app.set("trust proxy", 1);

  // Register Better Auth handler using official Node.js adapter
  // This handles ALL auth endpoints automatically:
  // - /api/auth/signin
  // - /api/auth/callback/:provider
  // - /api/auth/signout
  // - /api/auth/session
  // - /api/auth/providers
  const authHandler = toNodeHandler(auth);

  // Use base path for all auth routes (better-auth needs full path preserved)
  app.use("/api/auth", authHandler);
}
