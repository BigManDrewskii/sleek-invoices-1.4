# Comprehensive Migration Plan: Manus → Vercel

## SleekInvoices 1.4 Full Migration Strategy

**Date**: January 22, 2026
**Current Branch**: `mystifying-neumann`
**Target**: Production deployment on Vercel
**Status**: Ready for execution

---

## Executive Summary

This document provides a complete, step-by-step migration plan to move SleekInvoices from Manus infrastructure (Manus Auth, Manus Databases, Manus AI routing) to a standard Vercel deployment with external services.

### Current State Analysis

**What Works Now:**

- ✅ Auth.js fully integrated (Google + GitHub OAuth)
- ✅ Database schema migrated (Auth.js tables added, UUID system implemented)
- ✅ Serverless-compatible code structure with lazy initialization
- ✅ Vercel deployment configuration in place
- ✅ Environment variable validation system
- ✅ API handler structure (`api/index.js`)

**What Failed Yesterday:**

- ❌ Manus runtime plugin still in Vite config (causes build issues)
- ❌ Manus-specific allowed hosts in Vite config
- ❌ Database connection issues (likely SSL/TiDB compatibility)
- ❌ Environment variables not properly configured in Vercel
- ❌ Cron jobs not handled (serverless incompatible)

**Root Causes Identified:**

1. **Vite build still includes `vite-plugin-manus-runtime`** - this plugin tries to inject Manus-specific code
2. **Database connection string format** - may need adjustment for TiDB vs standard MySQL
3. **Missing critical environment variables** in Vercel dashboard
4. **Cron jobs still using node-cron** - won't work in serverless, needs Vercel Cron Jobs
5. **PDF generation in serverless** - memory/timeout issues

---

## Phase 1: Clean Up Manus Dependencies (30 min)

### 1.1 Remove Manus Runtime Plugin

**File**: `vite.config.ts`

**Current problematic code:**

```typescript
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(), // ❌ REMOVE THIS
];
```

**Fix:**

```typescript
const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  // Manus runtime plugin removed - Vercel deployment
];
```

**Also remove from `package.json`:**

```json
{
  "devDependencies": {
    "vite-plugin-manus-runtime": "^0.0.57" // ❌ REMOVE THIS LINE
  }
}
```

**Verification:**

```bash
pnpm install
pnpm build  # Should complete without Manus-related errors
```

### 1.2 Remove Manus-Specific Allowed Hosts

**File**: `vite.config.ts`

**Current code:**

```typescript
server: {
  allowedHosts: [
    ".manuspre.computer",
    ".manus.computer",
    ".manus-asia.computer",
    ".manuscomputer.ai",
    ".manusvm.computer",
    "localhost",
    "127.0.0.1",
  ],
}
```

**Fix:**

```typescript
server: {
  allowedHosts: [
    "localhost",
    "127.0.0.1",
    ".vercel.app",  // ✅ ADD for Vercel preview deployments
  ],
}
```

### 1.3 Verify No Manus Auth Remnants

**Search and remove:**

```bash
grep -r "manus" server/ client/src/ --exclude-dir=node_modules
```

**Expected results should be:**

- Comments only (OK)
- No actual Manus SDK imports or usage

**Files to check:**

- `server/_core/context.ts` - Ensure SKIP_AUTH is only for local dev
- `client/src/pages/` - No Manus OAuth buttons
- `server/_core/auth.ts` - Using Auth.js only (not Manus)

---

## Phase 2: Database Migration (1-2 hours)

### 2.1 Choose Database Strategy

**Option A: Keep Current TiDB/MySQL**

- ✅ No data migration needed
- ✅ Already working in Manus
- ⚠️ Must ensure SSL connection works from Vercel
- ⚠️ May need connection pooling (PlanetScale offers this)

**Option B: Migrate to PlanetScale (Recommended)**

- ✅ Free tier available
- ✅ Built-in connection pooling (critical for serverless)
- ✅ Auto-scaling
- ✅ Branching for staging
- ❌ Requires data migration (30-60 min)

**Recommendation**: Migrate to PlanetScale for production-ready serverless compatibility.

### 2.2 PlanetScale Migration Steps (if chosen)

#### Step 1: Create PlanetScale Database

```bash
# Install CLI
brew install planetscale/tap/pscale

# Authenticate
pscale auth login

# Create database
pscale database create sleekinvoices --region us-east

# Get connection string
pscale connection-string sleekinvoices production --format javascript
```

#### Step 2: Migrate Data

```bash
# Export from current database
mysqldump -h current-host -u user -p database > backup.sql

# Import to PlanetScale
pscale shell sleekinvoices production < backup.sql

# Or use PlanetScale's import feature in dashboard
```

#### Step 3: Update Connection String

**Vercel Environment Variable:**

```
DATABASE_URL=mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud/sleekinvoices?ssl={"rejectUnauthorized":true}
```

### 2.3 If Keeping TiDB/MySQL

**Update `server/db/connection.ts`:**

```typescript
export async function getDb() {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Parse connection string and force SSL for production
    const url = new URL(connectionString);

    // For TiDB/PlanetScale, ensure SSL is enabled
    const ssl = url.searchParams.get("ssl");
    if (!ssl && process.env.NODE_ENV === "production") {
      console.warn("[DB] Enabling SSL for production database connection");
      url.searchParams.set("ssl", '{"rejectUnauthorized":true}');
    }

    db = mysql.pool({
      url: url.toString(),
      connectionLimit: 10, // Limit for serverless
      idleTimeout: 20_000, // Close idle connections quickly
    });
  }

  return db;
}
```

---

## Phase 3: Environment Variables Setup (45 min)

### 3.1 Generate Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate Auth.js secret
openssl rand -base64 32
```

### 3.2 Configure OAuth Providers

#### Google OAuth (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Authorized JavaScript origins:
   - `http://localhost:5173` (local dev)
   - `https://sleekinvoices.vercel.app` (production)
4. Authorized redirect URIs:
   - `http://localhost:5173/api/auth/callback/google`
   - `https://sleekinvoices.vercel.app/api/auth/callback/google`

#### GitHub OAuth (Recommended)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Register new OAuth app
3. Authorization callback URL:
   - `http://localhost:5173/api/auth/callback/github` (dev)
   - `https://sleekinvoices.vercel.app/api/auth/callback/github` (prod)

### 3.3 Add to Vercel Dashboard

**Vercel Dashboard → Project → Settings → Environment Variables**

| Variable                 | Required?   | Environment                                      |
| ------------------------ | ----------- | ------------------------------------------------ |
| `DATABASE_URL`           | ✅ Required | Production + Preview                             |
| `JWT_SECRET`             | ✅ Required | Production + Preview                             |
| `AUTH_SECRET`            | ✅ Required | Production + Preview                             |
| `AUTH_GOOGLE_ID`         | ✅ Required | Production + Preview                             |
| `AUTH_GOOGLE_SECRET`     | ✅ Required | Production + Preview                             |
| `AUTH_GITHUB_ID`         | Optional    | Production + Preview                             |
| `AUTH_GITHUB_SECRET`     | Optional    | Production + Preview                             |
| `OAUTH_SERVER_URL`       | ✅ Required | Production: `https://sleekinvoices.vercel.app`   |
| `NODE_ENV`               | ✅ Required | Production: `production`, Preview: `development` |
| `VERCEL`                 | ✅ Required | All: `1`                                         |
| `PDF_GENERATION_ENABLED` | Optional    | Production: `false` (recommended)                |
| `STRIPE_SECRET_KEY`      | Optional    | Production                                       |
| `STRIPE_WEBHOOK_SECRET`  | Optional    | Production                                       |
| `RESEND_API_KEY`         | Optional    | Production                                       |
| `OPENROUTER_API_KEY`     | Optional    | Production                                       |
| `S3_BUCKET`              | Optional    | Production                                       |
| `S3_REGION`              | Optional    | Production                                       |
| `S3_ACCESS_KEY_ID`       | Optional    | Production                                       |
| `S3_SECRET_ACCESS_KEY`   | Optional    | Production                                       |

**Critical: Select "All Environments" for core auth/database variables.**

---

## Phase 4: Handle Cron Jobs (1-2 hours)

**Problem**: `node-cron` won't work in serverless (no long-running process).

**Current code** (`server/jobs/scheduler.ts`):

```typescript
import cron from "node-cron";

// This NEVER runs in Vercel serverless!
cron.schedule("0 0 * * *", generateRecurringInvoices);
```

**Solution**: Migrate to Vercel Cron Jobs

### 4.1 Create Vercel Cron Endpoint

**New file**: `api/crons/recurring-invoices.ts`

```typescript
import { generateRecurringInvoices } from "../../server/jobs/recurring-invoices";

export default async function handler(req, res) {
  // Verify Vercel cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await generateRecurringInvoices();
    res
      .status(200)
      .json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 4.2 Update `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/crons/recurring-invoices",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/crons/check-overdue",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/crons/send-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 4.3 Generate Cron Secret

```bash
openssl rand -base64 32
```

Add to Vercel: `CRON_SECRET`

---

## Phase 5: Fix PDF Generation (30 min)

**Problem**: Puppeteer in serverless causes:

- Memory errors (PDF generation needs ~500MB)
- Timeout errors (Vercel max 30s on Pro plan)

### Solutions

#### Option A: Disable Serverless PDF (Current implementation)

**Already implemented in `server/_core/index.ts`:**

```typescript
if (process.env.PDF_GENERATION_ENABLED === "false") {
  return res.status(503).json({
    error: "PDF generation disabled in serverless",
    message: "Use browser print instead (Ctrl+P / Cmd+P)",
  });
}
```

**Vercel env var**: `PDF_GENERATION_ENABLED=false`

#### Option B: Use Serverless PDF Service (Recommended for production)

**Services**: Cloudmersive, PDF.co, or PDFMonkey

**Implementation example**:

```typescript
// server/pdf-service.ts
export async function generatePDFWithService(data: any) {
  const response = await fetch(
    "https://api.cloudmersive.com/convert/html/to/pdf",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: process.env.CLOUDMERSIVE_API_KEY,
      },
      body: JSON.stringify({ html: renderInvoiceHtml(data) }),
    }
  );

  return await response.arrayBuffer();
}
```

---

## Phase 6: Testing & Validation (2-3 hours)

### 6.1 Pre-Deployment Checklist

```bash
# 1. Test build locally
pnpm install
pnpm build
ls -la dist/_server/index.js  # Should exist
ls -la dist/public/index.html  # Should exist

# 2. Test local serverless simulation
pnpm start

# 3. Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/test-env

# 4. Test database connection
curl http://localhost:3000/api/health/detailed
```

### 6.2 Deploy to Vercel Preview

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel
```

**Test endpoints on preview URL:**

- `/api/health` - Should return `{"status":"healthy"}`
- `/api/test-env` - Should show all env vars set
- `/api/auth/signin` - Should show Auth.js sign-in page
- `/` - Should load React app

### 6.3 Production Deployment

```bash
# Merge to main branch
git checkout main
git merge mystifying-neumann

# Deploy to production
vercel --prod
```

### 6.4 Post-Deployment Tests

**Authentication Flow:**

1. Visit `https://sleekinvoices.vercel.app`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Verify redirect to dashboard
5. Check database for `accounts` and `sessions` records

**Core Features:**

- Create invoice ✅
- Send invoice ✅
- View invoice list ✅
- Client portal ✅
- Settings page ✅

**Webhooks:**

- Test Stripe webhook (if configured)
- Test Resend webhook (if configured)

---

## Phase 7: Monitoring & Optimization (Ongoing)

### 7.1 Set Up Monitoring

**Vercel Analytics** (auto-enabled):

- Track page views
- Monitor function invocations
- Error rates

**Sentry** (already integrated):

```typescript
// Check server/_core/errorMonitoring.ts
// Should send errors to Sentry
```

### 7.2 Performance Tuning

**Serverless Function Optimization:**

```json
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "memory": 1024, // Increase for PDF
      "maxDuration": 30, // Max for Pro plan
      "runtime": "nodejs20"
    }
  }
}
```

**Database Connection Pooling:**

- Use PlanetScale's built-in pooling
- Or use external service: PgBouncer, ProxySQL

**Caching Strategy:**

```typescript
// Add Redis for frequent queries (optional)
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedUser(id: number) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await getUserById(id);
  await redis.setex(`user:${id}`, 300, JSON.stringify(user)); // 5min
  return user;
}
```

### 7.3 Cost Monitoring

**Vercel Pro Plan** ($20/month):

- 100GB bandwidth
- 1000 serverless function invocations/day
- 30s execution time

**Expected usage for SleekInvoices:**

- ~50-100 invocations/day for small user base
- ~500MB-1GB bandwidth/month
- Should stay well within free tier initially

---

## Troubleshooting Guide

### Issue: Build Fails with "Cannot find module"

**Cause**: Manus plugin still in build process

**Fix**:

```bash
# Remove from package.json
pnpm remove vite-plugin-manus-runtime

# Remove from vite.config.ts
# Delete line: vitePluginManusRuntime(),

# Clean rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Issue: 500 Error on All API Routes

**Cause**: Environment variables missing

**Diagnose**:

```bash
# Visit /api/test-env
# Check which variables are MISSING
```

**Fix**:

1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Add missing variables
4. Redeploy

### Issue: Database Connection Timeout

**Cause**: SSL or connection pool issues

**Diagnose**:

```bash
# Visit /api/health/detailed
# Check database latency
```

**Fix**:

1. Ensure `DATABASE_URL` has `ssl={"rejectUnauthorized":true}`
2. Reduce `connectionLimit` to 10
3. Add `idleTimeout: 20_000`
4. Consider PlanetScale (built-in pooling)

### Issue: OAuth Callback Fails

**Cause**: Redirect URI mismatch

**Fix**:

1. Check OAuth provider dashboard
2. Ensure `https://your-app.vercel.app/api/auth/callback/google` is listed
3. Check `OAUTH_SERVER_URL` env var matches exactly

### Issue: Cron Jobs Not Running

**Cause**: Using `node-cron` instead of Vercel Cron

**Fix**:

1. Create API endpoints in `api/crons/`
2. Update `vercel.json` with `crons` array
3. Add `CRON_SECRET` to Vercel env vars

### Issue: PDF Generation Timeout

**Cause**: Puppeteer too slow for serverless

**Fix**:

1. Set `PDF_GENERATION_ENABLED=false`
2. Guide users to use browser print
3. Or migrate to PDF generation service (Cloudmersive, PDF.co)

---

## Rollback Plan

If production deployment fails:

### Option 1: Vercel Rollback

1. Go to Vercel Dashboard
2. Deployments tab
3. Find previous working deployment
4. Click "Promote to Production"

### Option 2: Git Rollback

```bash
git revert HEAD
git push origin main
vercel --prod
```

### Option 3: Manual Rollback to Manus

```bash
# Go back to working commit
git checkout <working-commit-hash>

# Restore Manus dependencies
# (if they were removed)
git checkout HEAD~1 package.json vite.config.ts

pnpm install
pnpm build
```

---

## Migration Timeline Estimate

| Phase                             | Duration      | Dependencies |
| --------------------------------- | ------------- | ------------ |
| Phase 1: Clean Manus Dependencies | 30 min        | None         |
| Phase 2: Database Migration       | 1-2 hours     | Phase 1      |
| Phase 3: Environment Variables    | 45 min        | Phase 1      |
| Phase 4: Cron Jobs                | 1-2 hours     | Phase 1      |
| Phase 5: PDF Generation           | 30 min        | None         |
| Phase 6: Testing                  | 2-3 hours     | Phases 1-5   |
| Phase 7: Monitoring               | Ongoing       | Phase 6      |
| **Total**                         | **6-9 hours** |              |

**Recommended schedule**: Complete in one day, or split over 2 days with Phase 6 on day 2.

---

## Success Criteria

Migration is successful when:

- ✅ `/api/health` returns 200 with healthy status
- ✅ `/api/auth/signin` loads Auth.js sign-in page
- ✅ Google OAuth flow completes successfully
- ✅ User can create, view, and send invoices
- ✅ Database operations work without errors
- ✅ Webhooks receive and process events
- ✅ Cron jobs run on schedule (Vercel Cron)
- ✅ No 500 errors in Vercel logs
- ✅ Page load time < 3 seconds
- ✅ Mobile responsive still works

---

## Post-Migration Tasks

### Week 1: Monitor & Stabilize

- Check Vercel logs daily for errors
- Monitor database connection pool usage
- Test all critical user flows daily
- Gather user feedback on any issues

### Week 2: Optimize

- Add caching layer if needed
- Optimize slow database queries
- Tune serverless function memory/duration
- Set up alerts for error rates

### Week 3: Scale

- Consider multi-region deployment
- Implement CDN for static assets
- Add Redis for session caching
- Optimize bundle sizes

### Month 1: Review

- Analyze Vercel invoice ($20/month expected)
- Review serverless function usage
- Plan for scale if user base grows
- Document lessons learned

---

## Appendices

### Appendix A: File Changes Summary

**Files to modify:**

1. `vite.config.ts` - Remove Manus plugin, update allowedHosts
2. `package.json` - Remove `vite-plugin-manus-runtime`
3. `vercel.json` - Add cron jobs configuration
4. `server/db/connection.ts` - Add SSL enforcement

**Files to create:**

1. `api/crons/recurring-invoices.ts`
2. `api/crons/check-overdue.ts`
3. `api/crons/send-reminders.ts`

**Environment variables to add to Vercel:**

- `DATABASE_URL`
- `JWT_SECRET`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `OAUTH_SERVER_URL`
- `CRON_SECRET`
- `PDF_GENERATION_ENABLED`

### Appendix B: Command Reference

```bash
# Local development
pnpm install
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server locally
pnpm test            # Run tests
pnpm check           # Type checking

# Database operations
pnpm db:push         # Push schema changes
pnpm db:audit        # Check for inconsistencies
pnpm db:seed         # Seed test data

# Vercel deployment
vercel login
vercel              # Deploy preview
vercel --prod       # Deploy to production
vercel env add KEY  # Add environment variable
vercel env ls       # List all env vars
vercel logs         # View deployment logs

# PlanetScale (if using)
pscale auth login
pscale database create <name>
pscale connection-string <database> production
```

### Appendix C: Resource Links

**Documentation:**

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Auth.js](https://authjs.dev/)
- [PlanetScale](https://planetscale.com/docs)

**Services:**

- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [Cloudmersive PDF API](https://cloudmersive.com/pdf-api)

**Migration Tools:**

- [Vercel CLI](https://github.com/vercel/vercel/tree/main/cli)
- [PlanetScale CLI](https://github.com/planetscale/cli)
- [mysqldump](https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html)

---

## Contact & Support

**Migration Lead**: [Your Name]
**Date**: January 22, 2026
**Version**: 1.0

**Emergency Rollback**: If production is down for > 30 min, execute rollback immediately (see Rollback Plan section).

**Questions**: Refer to troubleshooting section or consult relevant documentation links.

---

**End of Migration Plan**
