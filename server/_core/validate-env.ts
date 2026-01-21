/**
 * Environment Variable Validation
 *
 * Validates required and recommended environment variables at startup
 * Throws descriptive errors if required variables are missing
 */

export function validateRequiredEnvVars(): void {
  const required = [
    "DATABASE_URL",
    "JWT_SECRET",
    "AUTH_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please add these in Vercel Dashboard → Project Settings → Environment Variables\n` +
        `Generate JWT_SECRET and AUTH_SECRET with: openssl rand -base64 32`
    );
  }

  // Warn about optional but recommended vars
  const recommended = ["AUTH_GOOGLE_ID", "AUTH_GITHUB_ID"];

  const missingRecommended = recommended.filter((key) => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn(
      `[Init] Warning: Missing recommended environment variables: ${missingRecommended.join(", ")}`
    );
    console.warn(
      `[Init] Users will not be able to sign in without at least one OAuth provider configured`
    );
  }

  console.log("[Init] ✓ Environment variables validated");
}
