import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export async function GET(request: NextRequest) {
  const env = {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? "SET" : "NOT_SET",
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? "SET" : "NOT_SET",
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ? "SET" : "NOT_SET",
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ? "SET" : "NOT_SET",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT_SET",
    DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT_SET",
    NODE_ENV: process.env.NODE_ENV || "NOT_SET",
  };

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: env,
    headers: Object.fromEntries(request.headers.entries()),
  });
}
