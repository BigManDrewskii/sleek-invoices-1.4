// Vercel API Handler
// This file serves as the entry point for Vercel serverless functions
// It delegates all requests to the Express application bundled at dist/_server/index.js

import createApp from '../dist/_server/index.js';

// Lazy initialization: create app instance on first request
// This avoids module load crashes when environment variables are not yet available
let appInstance = null;

// Vercel serverless function handler
// Vercel provides req/res in Express-compatible format
export default function handler(req, res) {
  if (!appInstance) {
    appInstance = createApp();
  }
  appInstance(req, res);
}
