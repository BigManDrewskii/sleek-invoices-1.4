// Test endpoint to verify environment variables and basic functionality
// This should NOT crash - if it does, there's a module loading issue

export default function handler(req, res) {
  try {
    const env = {
      DATABASE_URL: !!process.env.DATABASE_URL ? "SET" : "MISSING",
      JWT_SECRET: !!process.env.JWT_SECRET ? "SET" : "MISSING",
      AUTH_SECRET: !!process.env.AUTH_SECRET ? "SET" : "MISSING",
      AUTH_GOOGLE_ID: !!process.env.AUTH_GOOGLE_ID ? "SET" : "MISSING",
      AUTH_GITHUB_ID: !!process.env.AUTH_GITHUB_ID ? "SET" : "MISSING",
      VERCEL: process.env.VERCEL || "NOT_SET",
      NODE_ENV: process.env.NODE_ENV || "NOT_SET",
    };

    const missing = ["DATABASE_URL", "JWT_SECRET", "AUTH_SECRET"].filter(
      key => !process.env[key]
    );

    res.status(200).json({
      status: missing.length > 0 ? "error" : "ok",
      environment: env,
      missing,
      message:
        missing.length > 0
          ? `Missing required variables: ${missing.join(", ")}`
          : "All required environment variables are set",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Test endpoint crashed",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
