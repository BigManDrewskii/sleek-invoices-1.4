import type { Express } from "express";
import { authHandler } from "./auth";
import rawBody from "raw-body";

export function registerAuthRoutes(app: Express) {
  app.all("/api/auth/*", async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

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

    // Set status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Handle different response types (JSON, text, redirects)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      res.json(await response.json());
    } else if (response.redirected) {
      // Handle 3xx redirects
      res.redirect(response.status, response.url);
    } else {
      res.send(await response.text());
    }
  });
}
