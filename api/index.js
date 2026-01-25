// Vercel API Handler
// This file serves as the entry point for Vercel serverless functions
// It delegates all requests to the Express application bundled at dist/_server/index.js

let appInstance = null;

// Lazy initialization with error handling
async function getApp() {
  if (!appInstance) {
    try {
      // Dynamic import to catch module loading errors
      const { createApp } = await import('../dist/_server/index.js');
      appInstance = await createApp();
    } catch (error) {
      console.error('[Vercel] Failed to initialize app:', error);
      throw error;
    }
  }
  return appInstance;
}

// Vercel serverless function handler
// Vercel provides req/res in Express-compatible format
export default async function handler(req, res) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (error) {
    console.error('[Vercel] Handler error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
