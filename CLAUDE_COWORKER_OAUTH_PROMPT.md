# OAuth Callback 404 Errors - Fix Request

## Problem Summary

OAuth callbacks (Google & GitHub) are returning 404 errors in production on Vercel. The signin flow initiates correctly, but when the OAuth provider redirects back to the callback URL, the application returns 404 NOT_FOUND.

## Error Messages

**Google OAuth:**
```
google: 404: NOT_FOUND
Code: NOT_FOUND
ID: fra1::rrl9h-1769335245688-7b5f4acf268f
```

**GitHub OAuth:**
```
github: 404: NOT_FOUND
Code: NOT_FOUND
ID: fra1::dh2xj-1769335258530-82288bd610e7
```

## Tech Stack

- **Framework:** Express.js with @auth/express v0.12.1
- **Deployment:** Vercel serverless functions
- **Auth:** Auth.js v5 (formerly NextAuth.js)
- **Database:** MySQL (TiDB/PlanetScale) with Drizzle ORM
- **Adapter:** @auth/drizzle-adapter for database sessions

## Configuration

### Auth Configuration (`server/_core/auth.ts`)
- Using `trustHost: true` for auto-detecting URL from request headers
- Drizzle adapter with database session strategy
- Google and GitHub OAuth providers configured
- `AUTH_URL` environment variable is set in Vercel

### Vercel Routing (`vercel.json`)
```json
"routes": [
  {
    "src": "/api/(.*)",
    "dest": "/api/index.js"
  },
  ...
]
```

### Vercel Serverless Handler (`api/index.js`)
Recently updated to properly await Express response:
```javascript
export default async function handler(req, res) {
  try {
    const app = await getApp();
    return new Promise((resolve, reject) => {
      try {
        app(req, res);
        res.on('finish', () => resolve());
        res.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  } catch (error) {
    console.error('[Vercel] Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}
```

### Auth Routes (`server/_core/auth-routes.ts`)
```typescript
export async function registerAuthRoutes(app: Express) {
  app.set("trust proxy", true);
  const authConfig = await createAuthConfig();
  app.use("/api/auth/*", ExpressAuth(authConfig));
}
```

## What's Working

✅ `/api/health` - Returns healthy status
✅ `/api/auth/providers` - Returns both Google and GitHub providers with correct URLs
✅ `/api/auth/session` - Returns null for unauthenticated users (correct)
✅ Database connection - Verified working
✅ OAuth initiation - Clicking "Log In with Google/GitHub" redirects to provider

## What's NOT Working

❌ `/api/auth/callback/google` - Returns 404 NOT_FOUND
❌ `/api/auth/callback/github` - Returns 404 NOT_FOUND
❌ OAuth providers redirect back to callback URL but get 404 response

## Callback URLs Configuration

**Google OAuth Console:**
- Callback URL: `https://sleek-invoices-1-4.vercel.app/api/auth/callback/google`

**GitHub OAuth App:**
- Callback URL: `https://sleek-invoices-1-4.vercel.app/api/auth/callback/github`

## Recent Changes Attempted

1. **Removed top-level await export** from `server/_core/auth.ts` (line 73) - REVERTED
2. **Removed AUTH_URL** from Vercel environment - RESTORED (broke OAuth)
3. **Updated api/index.js** to properly await Express response - CURRENT STATE

## Root Cause Hypothesis

The issue is likely that:
1. Vercel's routing isn't forwarding `/api/auth/callback/*` requests to Express
2. The `@auth/express` middleware isn't handling the requests properly in serverless
3. There's a timing issue with async initialization in serverless environment
4. The Express route registration order is preventing auth routes from being reached

## Files to Investigate

1. **`api/index.js`** - Vercel serverless entry point
2. **`vercel.json`** - Routing configuration
3. **`server/_core/index.ts`** - Express app creation and route registration
4. **`server/_core/auth-routes.ts`** - Auth middleware registration
5. **`server/_core/auth.ts`** - Auth configuration
6. **`dist/_server/index.js`** - Bundled Express app (if build-time issue)

## Expected Behavior

1. User clicks "Log In with Google"
2. Redirects to Google OAuth
3. User approves
4. Google redirects to: `https://sleek-invoices-1-4.vercel.app/api/auth/callback/google?code=...&state=...`
5. Auth.js handles callback, creates session, redirects to `/dashboard`

## Actual Behavior

Steps 1-4 work correctly, but step 5 returns **404 NOT_FOUND** instead of processing the callback.

## Debug Information Needed

1. Check if `/api/auth/callback/*` routes are actually registered in Express
2. Verify Vercel is forwarding these requests to the Express app
3. Check if there are any errors in Vercel function logs during callback
4. Verify the Express middleware order isn't blocking auth routes
5. Test if the issue is specific to serverless vs local development

## Success Criteria

- [ ] Google OAuth callback completes successfully
- [ ] GitHub OAuth callback completes successfully
- [ ] User is redirected to `/dashboard` after OAuth approval
- [ ] Session is created in database
- [ ] No 404 errors on callback URLs

## Environment Variables (Vercel Production)

- ✅ AUTH_SECRET - Set
- ✅ AUTH_GOOGLE_ID - Set
- ✅ AUTH_GOOGLE_SECRET - Set
- ✅ AUTH_GITHUB_ID - Set
- ✅ AUTH_GITHUB_SECRET - Set
- ✅ AUTH_URL - Set to `https://sleek-invoices-1-4.vercel.app`
- ✅ DATABASE_URL - Set and working

## Additional Context

- Local development works correctly (when SKIP_AUTH=true bypass is used)
- Health endpoints work in production
- Auth providers endpoint works in production
- Issue is specific to OAuth callback URLs in production
- Recent commit: `cefa501` - "fix: properly await Express response in Vercel serverless handler"

## Request

Please investigate the OAuth callback 404 errors and fix the issue. Focus on:
1. Why the callback URLs return 404
2. Whether Vercel routing is properly configured
3. Whether the Express app is correctly handling the auth routes
4. Any serverless-specific issues that might cause this behavior

Thank you!
