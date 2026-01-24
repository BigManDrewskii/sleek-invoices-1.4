import type { Express } from "express";
import { authHandler } from "./auth";
import rawBody from "raw-body";

export function registerAuthRoutes(app: Express) {
  app.all("/api/auth/*", async (req, res) => {
    // Detect protocol from Vercel/X-Forwarded-Proto header or default to https
    const proto =
      (req.headers["x-forwarded-proto"] as string) ||
      (req.headers.host?.startsWith("localhost") ? "http" : "https");

    // Get hostname from headers or req.host
    const host =
      (req.headers["x-forwarded-host"] as string) ||
      req.headers.host ||
      "localhost:3000";

    const url = new URL(req.url || "", `${proto}://${host}`);

    // Read raw body for POST requests
    let body: string | undefined;
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      // @ts-ignore - raw-body doesn't have proper types
      body = await rawBody(req, {
        encoding: "utf8",
        limit: "10mb",
      });
    }

    const request = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body,
    });

    const response = await authHandler(request);

    // Handle 3xx redirects (OAuth callbacks, sign-in flows)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        return res.redirect(response.status, location);
      }
    }

    // Set status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Handle different response types (JSON, text)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      res.json(await response.json());
    } else {
      res.send(await response.text());
    }
  });
}
