# 2-Day Migration Execution Plan
## Manus → Vercel Migration (PlanetScale + Browser Print PDF)

**Timeline**: Split over 2 days (safer approach)
**Database**: Migrate to PlanetScale (recommended for serverless)
**PDF Strategy**: Disable serverless PDF, use browser print only
**OAuth Access**: Full access to Google Cloud Console and GitHub

---

## Day 1: Preparation & Infrastructure Setup
**Focus**: Get everything ready except production deployment
**Time**: 3-4 hours
**Risk Level**: Low (no production changes)

### Day 1, Morning: Cleanup & Local Testing (1 hour)

**9:00 AM - Remove Manus Dependencies**
- [ ] Create backup branch
  ```bash
  git checkout -b backup/pre-vercel-migration
  git push origin backup/pre-vercel-migration
  git checkout mystifying-neumann
  ```

- [ ] Edit `package.json` - Remove `vite-plugin-manus-runtime` from devDependencies
- [ ] Edit `vite.config.ts`:
  - Remove Manus plugin import
  - Remove from plugins array
  - Update `allowedHosts` to: `["localhost", "127.0.0.1", ".vercel.app"]`

- [ ] Reinstall and test build
  ```bash
  pnpm install
  pnpm build
  # Verify: dist/_server/index.js exists
  # Verify: dist/public/index.html exists
  ```

**9:30 AM - Local Verification**
- [ ] Test local server
  ```bash
  pnpm start
  curl http://localhost:3000/api/health
  # Should return: {"status":"healthy",...}
  ```
- [ ] Check browser console for errors at http://localhost:3000
- [ ] Verify SKIP_AUTH still works in local dev

**10:00 AM - Commit Manus cleanup**
  ```bash
  git add .
  git commit -m "feat: remove Manus runtime dependencies for Vercel deployment"
  git push origin mystifying-neumann
  ```

---

### Day 1, Mid-Day: PlanetScale Migration (2 hours)

**10:15 AM - Database Backup**
- [ ] Export current database
  ```bash
  # Via your current database admin panel or CLI:
  mysqldump -h [current-host] -u [user] -p [database] > backup_$(date +%Y%m%d).sql
  ```
- [ ] Save backup file securely (Google Drive, Dropbox, etc.)

**10:30 AM - PlanetScale Setup**
- [ ] Install PlanetScale CLI
  ```bash
  brew install planetscale/tap/pscale
  # Or: npm i -g @planetscale/cli
  ```

- [ ] Authenticate
  ```bash
  pscale auth login
  ```

- [ ] Create database
  ```bash
  pscale database create sleekinvoices --region us-east
  ```
  Choose `us-east` for closest to Vercel's default region.

**11:00 AM - Migrate Data to PlanetScale**

*Option A: Via PlanetScale Dashboard (Easier)*
1. Go to https://app.planetscale.com/sleekinvoices
2. Click "Import data"
3. Upload your `backup_YYYYMMDD.sql` file
4. Wait for import to complete (5-15 min depending on size)

*Option B: Via CLI*
```bash
# Get connection string
pscale connection-string sleekinvoices production --format javascript

# Import using MySQL client
mysql -h [pscale-host] -u [user] -p [database] < backup_YYYYMMDD.sql
```

- [ ] Verify data migration
  ```bash
  pscale shell sleekinvoices production
  > SHOW TABLES;
  > SELECT COUNT(*) FROM users;
  > SELECT COUNT(*) FROM invoices;
  > exit
  ```

**11:30 AM - Get PlanetScale Connection String**
```bash
pscale connection-string sleekinvoices production --format javascript
```

Example output:
```
mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud/sleekinvoices?ssl={"rejectUnauthorized":true}
```

**Copy this string** - you'll need it for Vercel environment variables.

**11:45 AM - Test PlanetScale Connection Locally**

Create temporary `.env.test`:
```bash
DATABASE_URL=[paste PlanetScale connection string here]
JWT_SECRET=test-secret-for-local-testing
AUTH_SECRET=test-auth-secret-for-local-testing
```

Test connection:
```bash
# Update server/db/connection.ts if needed for SSL (see comprehensive guide)
pnpm dev
```

Visit: http://localhost:3000/api/health/detailed
Should show database connection healthy.

**12:00 PM - Lunch Break**

---

### Day 1, Afternoon: OAuth & Cron Jobs (1.5 hours)

**1:00 PM - Generate Secrets**
```bash
# Generate JWT secret
openssl rand -base64 32
# Save output to secure note

# Generate Auth.js secret
openssl rand -base64 32
# Save output to secure note

# Generate Cron secret
openssl rand -base64 32
# Save output to secure note
```

**1:15 PM - Set up Google OAuth**

1. Go to https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: Web application
4. Name: "SleekInvoices Production"
5. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://sleekinvoices.vercel.app` (use your actual Vercel URL)
6. Authorized redirect URIs:
   - `http://localhost:5173/api/auth/callback/google`
   - `https://sleekinvoices.vercel.app/api/auth/callback/google`
7. Click "Create"
8. **Copy Client ID** and **Client Secret** to secure note

**1:30 PM - Set up GitHub OAuth (Optional but Recommended)**

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: "SleekInvoices Production"
4. Homepage URL: `https://sleekinvoices.vercel.app`
5. Authorization callback URL: `https://sleekinvoices.vercel.app/api/auth/callback/github`
6. Click "Register application"
7. **Copy Client ID** and generate new **Client Secret**
8. Save both to secure note

**1:45 PM - Create Vercel Cron Job Endpoints**

Create `api/crons/recurring-invoices.ts`:
```typescript
import { generateRecurringInvoices } from '../../server/jobs/recurring-invoices';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await generateRecurringInvoices();
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

Create `api/crons/check-overdue.ts`:
```typescript
import { checkOverdueInvoices } from '../../server/jobs/check-overdue';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await checkOverdueInvoices();
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

Create `api/crons/send-reminders.ts`:
```typescript
import { sendPaymentReminders } from '../../server/jobs/send-reminders';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await sendPaymentReminders();
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**2:15 PM - Update vercel.json**

Add cron configuration to `vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "regions": ["iad1"],
  "public": true,
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
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
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|webp))",
      "dest": "/dist/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/index.html"
    }
  ]
}
```

**2:30 PM - Commit Cron Jobs**
```bash
git add .
git commit -m "feat: add Vercel cron job endpoints"
git push origin mystifying-neumann
```

---

### Day 1, End: Vercel Project Setup (30 min)

**2:45 PM - Install Vercel CLI**
```bash
npm i -g vercel
vercel login
```

**3:00 PM - Link Project to Vercel**
```bash
vercel link
# Follow prompts:
# - Link to existing project? No
# - Project name: sleekinvoices
# - Directory: . (current directory)
# - Settings: Use defaults (or override if needed)
```

**3:15 PM - Add Environment Variables to Vercel**

Go to Vercel Dashboard → Project → Settings → Environment Variables

**Critical Variables** (click "All Environments" for each):

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | [Paste PlanetScale connection string] | From 11:30 AM |
| `JWT_SECRET` | [Paste JWT secret] | From 1:00 PM |
| `AUTH_SECRET` | [Paste Auth secret] | From 1:00 PM |
| `AUTH_GOOGLE_ID` | [Paste Google Client ID] | From 1:15 PM |
| `AUTH_GOOGLE_SECRET` | [Paste Google Client Secret] | From 1:15 PM |
| `AUTH_GITHUB_ID` | [Paste GitHub Client ID] | From 1:30 PM |
| `AUTH_GITHUB_SECRET` | [Paste GitHub Client Secret] | From 1:30 PM |
| `OAUTH_SERVER_URL` | `https://sleekinvoices.vercel.app` | Your Vercel URL |
| `NODE_ENV` | `production` | Hardcode |
| `VERCEL` | `1` | Hardcode |
| `CRON_SECRET` | [Paste Cron secret] | From 1:00 PM |
| `PDF_GENERATION_ENABLED` | `false` | Hardcode (browser print only) |

**Optional Variables** (add if using these services):
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `OPENROUTER_API_KEY`
- `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_ENVIRONMENT`, `QUICKBOOKS_REDIRECT_URI`

**3:45 PM - Deploy to Vercel Preview**
```bash
vercel
# This creates a preview deployment (not production)
# Note the preview URL, e.g., https://sleekinvoices-abc123.vercel.app
```

**4:00 PM - Test Preview Deployment**

Open preview URL in browser and test:
- [ ] Homepage loads without errors
- [ ] `/api/health` returns `{"status":"healthy",...}`
- [ ] `/api/test-env` shows all env vars as "SET"
- [ ] `/api/auth/signin` shows Auth.js sign-in page
- [ ] Try Google OAuth (should work)
- [ ] Check browser console (should be clean)
- [ ] Check Vercel logs: `vercel logs` (should have no ERROR messages)

**4:30 PM - End of Day 1**

**Status**: All infrastructure ready, preview deployment working
**Risk**: None yet (no production changes)
**Tomorrow**: Finalize and deploy to production

---

## Day 2: Production Deployment & Testing
**Focus**: Deploy to production and verify everything works
**Time**: 2-3 hours
**Risk Level**: Medium (production changes)

### Day 2, Morning: Final Preparations (30 min)

**9:00 AM - Review Day 1 Progress**

- [ ] Check preview deployment from Day 1 still works
- [ ] Verify all environment variables set in Vercel
- [ ] Review `COMPREHENSIVE_MIGRATION_PLAN.md` for any missed steps
- [ ] Ensure PlanetScale database is accessible and data is intact

**9:15 AM - Final Local Test**

```bash
# Pull latest changes
git pull origin mystifying-neumann

# Final build test
pnpm install
pnpm build

# Quick smoke test
pnpm start
# Visit http://localhost:3000
# Verify: Health check, auth page loads
```

**9:30 AM - Create Pre-Production Checklist**

Verify:
- [ ] Manus plugin removed from `package.json` and `vite.config.ts`
- [ ] PlanetScale database connection string ready
- [ ] All OAuth credentials configured
- [ ] Cron job endpoints created (`api/crons/*.ts`)
- [ ] `vercel.json` has cron configuration
- [ ] Environment variables set in Vercel Dashboard
- [ ] Preview deployment working
- [ ] Database backup created and saved

---

### Day 2, Mid-Morning: Production Deployment (1 hour)

**9:45 AM - Merge to Main Branch**

```bash
# Ensure we're on mystifying-neumann
git checkout mystifying-neumann

# Pull latest
git pull origin mystifying-neumann

# Switch to main
git checkout main

# Merge mystifying-neumann
git merge mystifying-neumann

# Push to GitHub (triggers Vercel auto-deploy if configured)
git push origin main
```

**10:00 AM - Deploy to Production**

```bash
vercel --prod
```

This will:
1. Build the project (same as `pnpm build`)
2. Deploy `dist/public/` to Vercel CDN
3. Deploy `api/index.js` as serverless function
4. Update routes and cron jobs
5. Make production live at `https://sleekinvoices.vercel.app`

**Expected output**:
```
✅ Production: https://sleekinvoices.vercel.app [5m]
```

**10:05 AM - Verify Deployment**

Check Vercel Dashboard:
- [ ] Deployment shows "Ready" status
- [ ] No build errors in deployment log
- [ ] Serverless function deployed successfully
- [ ] Cron jobs registered

**10:10 AM - DNS Configuration (If Using Custom Domain)**

Skip if using `*.vercel.app` domain.

If using custom domain (e.g., `app.sleekinvoices.com`):
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `app.sleekinvoices.com`
3. Vercel will show DNS records to add:
   - Type: `A` or `CNAME`
   - Name: `app` (or `@` for root)
   - Value: Provided by Vercel
4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Add DNS records
6. Wait for DNS propagation (5-30 min)
7. Verify domain is active in Vercel Dashboard

**10:30 AM - Initial Health Checks**

Open production URL: `https://sleekinvoices.vercel.app`

Test endpoints:
- [ ] `/api/health` - Should return 200 with `{"status":"healthy",...}`
- [ ] `/api/health/detailed` - Should show database latency < 500ms
- [ ] `/api/test-env` - Should show all env vars as "SET"
- [ ] `/` - Should load React app
- [ ] `/api/auth/signin` - Should show Auth.js sign-in page

**Check for errors**:
- Browser console (F12) - Should be no red errors
- Network tab - All requests should return 200 or 304
- Vercel logs: `vercel logs --prod` - Should be no ERROR messages

---

### Day 2, Mid-Day: Comprehensive Testing (1.5 hours)

**10:45 AM - Authentication Flow Test**

1. **Sign in with Google**
   - [ ] Click "Sign in with Google" button
   - [ ] Complete Google OAuth flow
   - [ ] Verify redirect to dashboard (not error page)
   - [ ] Check you're logged in (see your name/email)

2. **Verify Database Records**
   ```bash
   pscale shell sleekinvoices production
   > SELECT * FROM accounts WHERE userId = [your-user-id];
   > SELECT * FROM sessions WHERE userId = [your-user-id];
   > exit
   ```
   Should see OAuth account and session records.

3. **Sign Out Test**
   - [ ] Click sign out
   - [ ] Verify redirected to home page
   - [ ] Check cookies cleared (no session cookie)

**11:15 AM - Core Feature Tests**

1. **Dashboard**
   - [ ] Dashboard loads without errors
   - [ ] Charts render (recharts)
   - [ ] Stats display correctly

2. **Invoice Management**
   - [ ] Create new invoice
   - [ ] Add line items
   - [ ] Save invoice
   - [ ] View invoice list
   - [ ] Open invoice details
   - [ ] Edit invoice
   - [ ] Delete invoice (test invoice only)

3. **Client Management**
   - [ ] Create new client
   - [ ] View client list
   - [ ] Edit client details
   - [ ] Delete client (test client only)

4. **PDF Generation (Browser Print)**
   - [ ] Open invoice details
   - [ ] Click "Print" button (or Ctrl+P / Cmd+P)
   - [ ] Verify print preview shows correctly
   - [ ] Print to PDF as test
   - [ ] Check PDF formatting

5. **Settings Page**
   - [ ] Visit settings
   - [ ] Check all tabs load
   - [ ] Update user profile
   - [ ] Save changes

**11:45 AM - Database Operations Test**

Verify all database operations work:
- [ ] Create operations (invoices, clients, payments)
- [ ] Read operations (lists, details, searches)
- [ ] Update operations (edit invoice, edit client)
- [ ] Delete operations (delete test data)

Check PlanetScale dashboard:
- [ ] Query analytics (no slow queries > 1s)
- [ ] Connection pooling working
- [ ] No connection errors

**12:00 PM - Lunch Break**

---

### Day 2, Afternoon: Advanced Testing & Monitoring (1 hour)

**1:00 PM - Webhook Testing (If Configured)**

**Stripe Webhook:**
- [ ] Get Stripe webhook test URL from Vercel: `https://sleekinvoices.vercel.app/api/stripe/webhook`
- [ ] Add to Stripe Dashboard → Webhooks → Test mode
- [ ] Send test webhook event
- [ ] Verify Vercel logs show webhook received
- [ ] Check database for webhook processing

**Resend Webhook:**
- [ ] Similar test with Resend webhook endpoint
- [ ] Verify email delivery tracking works

**1:15 PM - Cron Job Testing**

Manual test of cron endpoints:
```bash
# Test recurring invoices cron
curl -H "Authorization: Bearer $CRON_SECRET" https://sleekinvoices.vercel.app/api/crons/recurring-invoices

# Test check overdue cron
curl -H "Authorization: Bearer $CRON_SECRET" https://sleekinvoices.vercel.app/api/crons/check-overdue

# Test send reminders cron
curl -H "Authorization: Bearer $CRON_SECRET" https://sleekinvoices.vercel.app/api/crons/send-reminders
```

All should return: `{"success":true,"timestamp":"..."}`

**1:30 PM - Performance Testing**

1. **Page Load Times**
   - [ ] Clear browser cache
   - [ ] Reload homepage (Cmd+Shift+R / Ctrl+Shift+R)
   - [ ] Check Network tab (F12) - Document load should be < 3s
   - [ ] Largest Contentful Paint (LCP) should be < 2.5s

2. **API Response Times**
   - [ ] `/api/health` - Should be < 100ms
   - [ ] `/api/trpc/auth.me` - Should be < 500ms
   - [ ] Invoice list API - Should be < 1s

3. **Database Latency**
   - [ ] Check `/api/health/detailed`
   - [ ] Database latency should be < 500ms

4. **Serverless Function Cold Start**
   - [ ] Wait 5 minutes (for function to go cold)
   - [ ] Make API request
   - [ ] First request might be 1-2s (cold start)
   - [ ] Subsequent requests should be < 500ms (warm)

**1:45 PM - Mobile Testing**

1. **Responsive Design**
   - [ ] Open DevTools (F12) → Toggle device toolbar
   - [ ] Test iPhone 12 Pro viewport
   - [ ] Test iPad viewport
   - [ ] Test Samsung Galaxy viewport

2. **Touch Interactions**
   - [ ] Mobile navigation menu
   - [ ] Form inputs (focus, keyboard)
   - [ ] Button taps
   - [ ] Swipe gestures (if any)

3. **Mobile Performance**
   - [ ] Page load acceptable on 3G simulation
   - [ ] No horizontal scrolling
   - [ ] Text is readable

**2:00 PM - Browser Compatibility Testing**

Test in multiple browsers:
- [ ] Chrome (primary)
- [ ] Safari (Mac/iOS)
- [ ] Firefox (secondary)
- [ ] Edge (if available)

Check for:
- Layout issues
- JavaScript errors
- CSS rendering problems

---

### Day 2, End: Monitoring & Documentation (30 min)

**2:15 PM - Set Up Monitoring**

1. **Vercel Analytics**
   - [ ] Go to Vercel Dashboard → Analytics
   - [ ] Verify metrics are being collected
   - [ ] Check page views, unique visitors
   - [ ] Monitor serverless function invocations

2. **Sentry Error Tracking**
   - [ ] Check `server/_core/errorMonitoring.ts`
   - [ ] Verify Sentry DSN configured (if using)
   - [ ] Send test error:
     ```javascript
     // In browser console:
     throw new Error("Test Sentry integration");
     ```
   - [ ] Check Sentry dashboard for error

3. **PlanetScale Insights**
   - [ ] Go to PlanetScale Dashboard → Insights
   - [ ] Check query performance
   - [ ] Review connection pool stats
   - [ ] Monitor slow queries (>1s)

**2:30 PM - Documentation**

Create production runbook:

**File**: `PRODUCTION_RUNBOOK.md`
```markdown
# SleekInvoices Production Runbook

## Deployment
- URL: https://sleekinvoices.vercel.app
- Vercel Project: sleekinvoices
- Database: PlanetScale sleekinvoices production

## Environment Variables
- See Vercel Dashboard → Settings → Environment Variables
- Never share secrets publicly

## Monitoring
- Vercel Dashboard: https://vercel.com/[username]/sleekinvoices
- PlanetScale Dashboard: https://app.planetscale.com/sleekinvoices
- Sentry (if configured): [Your Sentry URL]

## Rollback Procedure
If critical issues:
1. Vercel Dashboard → Deployments → Previous deployment → Promote to Production
2. Or: `git revert HEAD && git push origin main && vercel --prod`

## Common Issues
- Database timeout: Check PlanetScale status page
- OAuth failure: Verify redirect URIs in Google/GitHub consoles
- Cron jobs not running: Check `vercel.json` cron configuration
- PDF errors: Browser print only (PDF_GENERATION_ENABLED=false)

## Support
- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Auth.js Docs: https://authjs.dev/
```

**2:45 PM - Final Checks**

- [ ] All test items in this document checked off
- [ ] No errors in Vercel logs
- [ ] No errors in browser console
- [ ] All core features working
- [ ] Database operations smooth
- [ ] OAuth flow working
- [ ] Cron jobs configured
- [ ] Monitoring set up
- [ ] Documentation complete

**3:00 PM - Migration Complete! 🎉**

---

## Post-Migration: Week 1 Monitoring

### Daily Checks (5 min each day)

- [ ] **Monday**: Check Vercel logs for errors, test authentication
- [ ] **Tuesday**: Test invoice creation, check database stats
- [ ] **Wednesday**: Test payment flow, monitor cron jobs
- [ ] **Thursday**: Test all features, check performance
- [ ] **Friday**: Review week metrics, plan optimizations

### Metrics to Track

**Vercel Metrics** (Dashboard → Analytics):
- Page views per day
- Unique visitors
- Serverless function invocations
- Error rate (should be < 1%)

**Database Metrics** (PlanetScale Dashboard):
- Query count per day
- Slow queries (>1s)
- Connection pool usage
- Storage usage

**Performance Metrics** (DevTools Lighthouse):
- Performance score (should be > 90)
- Accessibility score (should be > 90)
- Best practices score (should be > 90)
- SEO score (should be > 90)

### Common Issues First Week

**Issue**: Database connection errors
- **Cause**: Connection pool exhausted
- **Fix**: Increase connection limit in `server/db/connection.ts`

**Issue**: OAuth login fails
- **Cause**: Redirect URI mismatch
- **Fix**: Verify URIs in Google/GitHub consoles match Vercel URL exactly

**Issue**: Cron jobs not running
- **Cause**: Cron secret mismatch
- **Fix**: Verify `CRON_SECRET` env var in Vercel

**Issue**: Page loads slowly
- **Cause**: Cold start or slow database
- **Fix**: Add caching layer, optimize queries, consider Edge Functions

---

## Success Criteria

Migration is **successful** when:

- [ ] All Day 1 and Day 2 tasks completed
- [ ] Production URL accessible and working
- [ ] OAuth authentication flow works
- [ ] All CRUD operations working (invoices, clients, payments)
- [ ] Database operations smooth (no timeouts)
- [ ] Cron jobs running on schedule
- [ ] No ERROR logs in Vercel
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive working
- [ ] Browser compatibility confirmed

**Estimated Migration Time**: 6-8 hours total (3-4 hours Day 1, 2-3 hours Day 2)

**Risk Level**: Low to Medium (2-day approach allows testing before production)

---

## Emergency Contacts & Resources

**If stuck**:
1. Check `COMPREHENSIVE_MIGRATION_PLAN.md` for detailed guidance
2. Check troubleshooting section below
3. Check official docs (Vercel, PlanetScale, Auth.js)
4. Consider rollback if production affected

**Rollback triggers**:
- Production down for > 30 min
- Critical features broken (auth, database)
- Data corruption or loss
- Security breach

**Happy migrating! 🚀**
