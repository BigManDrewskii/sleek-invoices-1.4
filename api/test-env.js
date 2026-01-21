// Test endpoint to verify environment variables
// Add this to api/ directory temporarily

export default function handler(req, res) {
  const env = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: !!process.env.AUTH_GOOGLE_ID,
    AUTH_GITHUB_ID: !!process.env.AUTH_GITHUB_ID,
    VERCEL: !!process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
  };

  const missing = Object.entries(env)
    .filter(([key, value]) => !value && ['DATABASE_URL', 'JWT_SECRET', 'AUTH_SECRET'].includes(key))
    .map(([key]) => key);

  res.status(200).json({
    status: missing.length > 0 ? 'error' : 'ok',
    environment: env,
    missing,
    message: missing.length > 0
      ? `Missing required variables: ${missing.join(', ')}`
      : 'All required environment variables are set',
  });
}
