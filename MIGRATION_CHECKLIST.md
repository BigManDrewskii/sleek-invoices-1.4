# Quick-Start Migration Checklist
## Manus → Vercel Migration (SleekInvoices 1.4)

**Print this checklist and check off each item as you complete it.**

---

## Pre-Migration Prep (15 min)

- [ ] **Create backup branch**
  ```bash
  git checkout -b backup/pre-vercel-migration
  git push origin backup/pre-vercel-migration
  git checkout mystifying-neumann
  ```

- [ ] **Create database backup**
  ```bash
  # Via TiDB/MySQL admin panel or CLI
  mysqldump -h host -u user -p database > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] **Document current environment variables**
  - [ ] Copy all `.env.local` values to secure note
  - [ ] Note current database host/port
  - [ ] Note current OAuth client IDs

---

## Phase 1: Remove Manus Dependencies (30 min)

- [ ] **Remove Manus plugin from package.json**
  ```bash
  # Edit package.json, remove this line:
  "vite-plugin-manus-runtime": "^0.0.57"
  ```

- [ ] **Remove Manus plugin from vite.config.ts**
  ```bash
  # Edit vite.config.ts:
  # 1. Remove: import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
  # 2. Remove from plugins array: vitePluginManusRuntime(),
  ```

- [ ] **Update allowed hosts in vite.config.ts**
  ```bash
  # Replace Manus domains with:
  allowedHosts: ["localhost", "127.0.0.1", ".vercel.app"]
  ```

- [ ] **Reinstall dependencies**
  ```bash
  pnpm install
  ```

- [ ] **Test build**
  ```bash
  pnpm build
  # Should complete without errors
  ls -la dist/_server/index.js  # Should exist
  ls -la dist/public/index.html  # Should exist
  ```

---

## Phase 2: OAuth Setup (45 min)

- [ ] **Generate secrets**
  ```bash
  openssl rand -base64 32  # Copy output as JWT_SECRET
  openssl rand -base64 32  # Copy output as AUTH_SECRET
  ```

- [ ] **Set up Google OAuth**
  - [ ] Go to https://console.cloud.google.com/apis/credentials
  - [ ] Create OAuth 2.0 Client ID
  - [ ] Authorized origins: `http://localhost:5173`, `https://sleekinvoices.vercel.app`
  - [ ] Redirect URIs: `http://localhost:5173/api/auth/callback/google`, `https://sleekinvoices.vercel.app/api/auth/callback/google`
  - [ ] Copy Client ID and Secret

- [ ] **Set up GitHub OAuth (optional but recommended)**
  - [ ] Go to https://github.com/settings/developers
  - [ ] Register new OAuth App
  - [ ] Callback URL: `https://sleekinvoices.vercel.app/api/auth/callback/github`
  - [ ] Copy Client ID and Secret

---

## Phase 3: Vercel Environment Variables (30 min)

- [ ] **Install Vercel CLI**
  ```bash
  npm i -g vercel
  vercel login
  ```

- [ ] **Connect project to Vercel**
  ```bash
  vercel link
  # Follow prompts, create new project or link existing
  ```

- [ ] **Add environment variables (use Vercel Dashboard: Project → Settings → Environment Variables)**

  **Critical Variables (select "All Environments"):**
  - [ ] `DATABASE_URL` - Your MySQL/TiDB connection string with SSL
  - [ ] `JWT_SECRET` - Generated with openssl above
  - [ ] `AUTH_SECRET` - Generated with openssl above
  - [ ] `AUTH_GOOGLE_ID` - From Google Cloud Console
  - [ ] `AUTH_GOOGLE_SECRET` - From Google Cloud Console
  - [ ] `AUTH_GITHUB_ID` - From GitHub OAuth settings
  - [ ] `AUTH_GITHUB_SECRET` - From GitHub OAuth settings
  - [ ] `OAUTH_SERVER_URL` - `https://sleekinvoices.vercel.app`
  - [ ] `NODE_ENV` - `production` for Production, `development` for Preview
  - [ ] `VERCEL` - `1`

  **Optional Variables (add if using these services):**
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `STRIPE_PRO_PRICE_ID`
  - [ ] `RESEND_API_KEY`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `S3_BUCKET`
  - [ ] `S3_REGION`
  - [ ] `S3_ACCESS_KEY_ID`
  - [ ] `S3_SECRET_ACCESS_KEY`
  - [ ] `QUICKBOOKS_CLIENT_ID`
  - [ ] `QUICKBOOKS_CLIENT_SECRET`
  - [ ] `QUICKBOOKS_ENVIRONMENT`
  - [ ] `QUICKBOOKS_REDIRECT_URI`

  **Feature Flags:**
  - [ ] `PDF_GENERATION_ENABLED` - Set to `false` (recommended for serverless)
  - [ ] `CRON_SECRET` - Generate with `openssl rand -base64 32` (for cron jobs)

---

## Phase 4: Cron Jobs Migration (1 hour)

- [ ] **Create cron job endpoints**
  - [ ] Create `api/crons/recurring-invoices.ts`
  - [ ] Create `api/crons/check-overdue.ts`
  - [ ] Create `api/crons/send-reminders.ts`

  **Template for each file:**
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

- [ ] **Update vercel.json with cron configuration**
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

---

## Phase 5: Pre-Deployment Testing (30 min)

- [ ] **Local build test**
  ```bash
  pnpm build
  # Verify no errors
  ```

- [ ] **Local server test**
  ```bash
  pnpm start
  # Test: http://localhost:3000/api/health
  # Should return: {"status":"healthy",...}
  ```

- [ ] **Deploy to Vercel preview**
  ```bash
  vercel
  # Note the preview URL
  ```

- [ ] **Test preview deployment**
  - [ ] Visit preview URL
  - [ ] Test `/api/health` endpoint
  - [ ] Test `/api/test-env` endpoint (check env vars)
  - [ ] Test `/api/auth/signin` (should show Auth.js page)
  - [ ] Check browser console for errors

---

## Phase 6: Production Deployment (15 min)

- [ ] **Commit all changes**
  ```bash
  git add .
  git commit -m "feat: complete Manus to Vercel migration"
  git push origin mystifying-neumann
  ```

- [ ] **Merge to main branch**
  ```bash
  git checkout main
  git merge mystifying-neumann
  git push origin main
  ```

- [ ] **Deploy to production**
  ```bash
  vercel --prod
  ```

- [ ] **Update DNS (if using custom domain)**
  - [ ] Go to Vercel Dashboard → Project → Settings → Domains
  - [ ] Add custom domain (e.g., `app.sleekinvoices.com`)
  - [ ] Update DNS records as instructed by Vercel
  - [ ] Wait for DNS propagation (5-30 min)

---

## Phase 7: Post-Deployment Testing (45 min)

- [ ] **Health checks**
  - [ ] `https://sleekinvoices.vercel.app/api/health` - Should return 200
  - [ ] `https://sleekinvoices.vercel.app/api/health/detailed` - Check DB latency

- [ ] **Authentication flow**
  - [ ] Visit homepage
  - [ ] Click "Sign in with Google"
  - [ ] Complete OAuth flow
  - [ ] Verify redirect to dashboard
  - [ ] Check you're logged in

- [ ] **Core features**
  - [ ] Create new invoice
  - [ ] Save invoice
  - [ ] View invoice list
  - [ ] Create client
  - [ ] View dashboard
  - [ ] Visit settings page

- [ ] **Webhooks (if configured)**
  - [ ] Test Stripe webhook endpoint
  - [ ] Test Resend webhook endpoint

- [ ] **Database verification**
  - [ ] Check that new invoices appear in database
  - [ ] Check that `sessions` table has OAuth session data
  - [ ] Check that `accounts` table has OAuth account linkage

---

## Phase 8: Monitoring Setup (30 min)

- [ ] **Set up Vercel Analytics**
  - [ ] Go to Vercel Dashboard → Analytics
  - [ ] Verify metrics are being collected

- [ ] **Check Vercel Logs**
  - [ ] Go to Deployments → Latest → Logs
  - [ ] Verify no ERROR level messages

- [ ] **Test alerting**
  - [ ] Set up error alerting in Vercel (if desired)
  - [ ] Verify Sentry is sending errors (check `server/_core/errorMonitoring.ts`)

---

## Rollback Procedures (IF NEEDED)

### If preview deployment fails:
```bash
# Fix issues, then redeploy preview
vercel
```

### If production deployment fails:

**Option 1: Vercel Dashboard Rollback**
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote to Production"

**Option 2: Git Revert**
```bash
git revert HEAD
git push origin main
vercel --prod
```

**Option 3: Emergency - Back to Manus**
```bash
git checkout backup/pre-vercel-migration
git push -f origin main
vercel --prod
```

---

## Post-Migration: Week 1 Tasks

- [ ] **Daily checks** (first 7 days)
  - [ ] Check Vercel logs for errors
  - [ ] Test authentication flow
  - [ ] Create test invoice
  - [ ] Monitor database connections

- [ ] **Performance monitoring**
  - [ ] Check page load times
  - [ ] Monitor serverless function duration
  - [ ] Review database query performance

- [ ] **User communication**
  - [ ] Notify users of migration (if applicable)
  - [ ] Monitor support channels for issues
  - [ ] Document any user-reported problems

---

## Troubleshooting Quick Reference

| Issue | Symptom | Quick Fix |
|-------|---------|-----------|
| Build fails | Module not found error | Run `pnpm install`, check Manus plugin removed |
| API returns 500 | All /api routes fail | Check env vars in Vercel Dashboard |
| OAuth fails | Callback error | Verify redirect URIs in OAuth provider |
| DB timeout | Slow/failed queries | Check DATABASE_URL has SSL enabled |
| PDF errors | Timeout/500 error | Set `PDF_GENERATION_ENABLED=false` |
| Cron not running | Jobs not executing | Check `vercel.json` has `crons` array |

---

## Success Criteria

Migration is complete when:

- [ ] All Phase 1-7 checkboxes checked
- [ ] `/api/health` returns 200
- [ ] OAuth flow works end-to-end
- [ ] Can create and manage invoices
- [ ] No 500 errors in Vercel logs
- [ ] Database operations working
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive working

---

## Contact & Support

**Migration Duration Estimate**: 6-9 hours total

**If stuck after 30 min on any phase**:
1. Check `COMPREHENSIVE_MIGRATION_PLAN.md` for detailed guidance
2. Check Vercel logs: `vercel logs`
3. Check browser console for client-side errors
4. Consider rollback if production is affected

**Emergency rollback**: If production is down for > 30 min, execute rollback immediately.

---

**Migration Date**: _______________

**Completed By**: _______________

**Notes**: _______________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________
