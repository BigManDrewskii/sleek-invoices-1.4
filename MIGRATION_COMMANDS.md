# Migration Command Reference
## Copy-Paste Commands for Manus → Vercel Migration

**Save this file for quick reference during migration.**

---

## Day 1 Commands

### Morning: Manus Cleanup

```bash
# Create backup branch
git checkout -b backup/pre-vercel-migration
git push origin backup/pre-vercel-migration
git checkout mystifying-neumann

# Edit package.json (manual step)
# Remove: "vite-plugin-manus-runtime": "^0.0.57"

# Edit vite.config.ts (manual step)
# Remove: import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
# Remove from plugins: vitePluginManusRuntime(),
# Update allowedHosts: ["localhost", "127.0.0.1", ".vercel.app"]

# Reinstall dependencies
pnpm install

# Test build
pnpm build

# Verify output
ls -la dist/_server/index.js
ls -la dist/public/index.html

# Test local server
pnpm start
# Visit: http://localhost:3000/api/health

# Commit changes
git add .
git commit -m "feat: remove Manus runtime dependencies for Vercel deployment"
git push origin mystifying-neumann
```

### Mid-Day: PlanetScale Migration

```bash
# Install PlanetScale CLI
brew install planetscale/tap/pscale
# Or: npm i -g @planetscale/cli

# Authenticate
pscale auth login

# Create database
pscale database create sleekinvoices --region us-east

# Export current database (using your current credentials)
mysqldump -h [current-host] -u [user] -p [database] > backup_$(date +%Y%m%d).sql

# Import to PlanetScale (via dashboard easier)
# Or via CLI:
mysql -h [pscale-host] -u [user] -p [database] < backup_$(date +%Y%m%d).sql

# Get connection string
pscale connection-string sleekinvoices production --format javascript
# Copy this output for Vercel env vars

# Verify migration
pscale shell sleekinvoices production
> SHOW TABLES;
> SELECT COUNT(*) FROM users;
> SELECT COUNT(*) FROM invoices;
> exit
```

### Afternoon: Secrets & OAuth

```bash
# Generate secrets
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # AUTH_SECRET
openssl rand -base64 32  # CRON_SECRET

# Save all three to secure note
```

**Manual Steps**:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add origins: `http://localhost:5173`, `https://sleekinvoices.vercel.app`
4. Add redirects: `http://localhost:5173/api/auth/callback/google`, `https://sleekinvoices.vercel.app/api/auth/callback/google`
5. Copy Client ID and Secret

6. Go to https://github.com/settings/developers
7. Register new OAuth App
8. Callback: `https://sleekinvoices.vercel.app/api/auth/callback/github`
9. Copy Client ID and Secret

### Cron Job Files

```bash
# Create cron directory
mkdir -p api/crons

# Create recurring-invoices.ts
cat > api/crons/recurring-invoices.ts << 'EOF'
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
EOF

# Create check-overdue.ts
cat > api/crons/check-overdue.ts << 'EOF
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
EOF

# Create send-reminders.ts
cat > api/crons/send-reminders.ts << 'EOF'
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
EOF

# Commit cron jobs
git add api/crons/
git commit -m "feat: add Vercel cron job endpoints"
git push origin mystifying-neumann
```

### Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel
vercel login

# Link project
vercel link
# Follow prompts, create new project

# Deploy preview
vercel
# Note the preview URL
```

---

## Day 2 Commands

### Morning: Production Deployment

```bash
# Pull latest changes
git pull origin mystifying-neumann

# Switch to main
git checkout main

# Merge mystifying-neumann
git merge mystifying-neumann

# Push to GitHub
git push origin main

# Deploy to production
vercel --prod
```

### Testing Commands

```bash
# Health checks
curl https://sleekinvoices.vercel.app/api/health
curl https://sleekinvoices.vercel.app/api/health/detailed

# Test env vars
curl https://sleekinvoices.vercel.app/api/test-env

# Test cron jobs (manual)
curl -H "Authorization: Bearer [YOUR_CRON_SECRET]" \
  https://sleekinvoices.vercel.app/api/crons/recurring-invoices

curl -H "Authorization: Bearer [YOUR_CRON_SECRET]" \
  https://sleekinvoices.vercel.app/api/crons/check-overdue

curl -H "Authorization: Bearer [YOUR_CRON_SECRET]" \
  https://sleekinvoices.vercel.app/api/crons/send-reminders
```

### Vercel CLI Commands

```bash
# View logs (all)
vercel logs

# View production logs
vercel logs --prod

# View logs for specific deployment
vercel logs [deployment-url]

# View environment variables
vercel env ls

# Add environment variable
vercel env add JWT_SECRET
# Select environment: production, preview, development

# Pull environment variables to .env file
vercel env pull .env.local

# View project info
vercel inspect

# View deployments
vercel ls

# Redeploy latest commit
vercel --prod --force

# Rollback to previous deployment
vercel rollback
```

### PlanetScale CLI Commands

```bash
# List databases
pscale database list

# View database branches
pscale branches list sleekinvoices

# View database schema
pscale schema show sleekinvoices production

# Open database shell
pscale shell sleekinvoices production

# View connection pool stats
pscale connection-pools list sleekinvoices production

# View deploy requests
pscale deploy-request list sleekinvoices

# Create backup
pscale backup create sleekinvoices production

# List backups
pscale backup list sleekinvoices production
```

### Git Commands

```bash
# View recent commits
git log --oneline -10

# View branch status
git status

# Create new branch
git checkout -b [branch-name]

# Merge branch
git merge [branch-name]

# Abort merge (if conflicts)
git merge --abort

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote branches
git branch -r

# View all branches
git branch -a

# Delete branch
git branch -d [branch-name]

# Force push (use carefully!)
git push --force origin main
```

---

## Environment Variables Template

Copy this to Vercel Dashboard → Settings → Environment Variables:

```bash
# Critical (Required)
DATABASE_URL=mysql://[user]:[pass]@[host]/[database]?ssl={"rejectUnauthorized":true}
JWT_SECRET=[generate with openssl]
AUTH_SECRET=[generate with openssl]
AUTH_GOOGLE_ID=[from Google Cloud Console]
AUTH_GOOGLE_SECRET=[from Google Cloud Console]
AUTH_GITHUB_ID=[from GitHub OAuth settings]
AUTH_GITHUB_SECRET=[from GitHub OAuth settings]
OAUTH_SERVER_URL=https://sleekinvoices.vercel.app
NODE_ENV=production
VERCEL=1
CRON_SECRET=[generate with openssl]

# Feature Flags
PDF_GENERATION_ENABLED=false

# Optional (Stripe)
STRIPE_SECRET_KEY=[from Stripe Dashboard]
STRIPE_WEBHOOK_SECRET=[from Stripe Dashboard]
STRIPE_PRO_PRICE_ID=[from Stripe Dashboard]

# Optional (Email)
RESEND_API_KEY=[from Resend Dashboard]

# Optional (AI)
OPENROUTER_API_KEY=[from OpenRouter]

# Optional (Storage)
S3_BUCKET=[your-bucket]
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=[your-key]
S3_SECRET_ACCESS_KEY=[your-secret]

# Optional (QuickBooks)
QUICKBOOKS_CLIENT_ID=[from Intuit Developer]
QUICKBOOKS_CLIENT_SECRET=[from Intuit Developer]
QUICKBOOKS_ENVIRONMENT=production
QUICKBOOKS_REDIRECT_URI=https://sleekinvoices.vercel.app/api/quickbooks/callback
```

---

## vercel.json Template

Copy this to `vercel.json`:

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

---

## vite.config.ts Template

Update `vite.config.ts` to this:

```typescript
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Manus runtime plugin removed for Vercel deployment

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          if (id.includes("node_modules/react-hook-form/") || id.includes("node_modules/@hookform/") || id.includes("node_modules/zod/")) {
            return "vendor-forms";
          }
          if (id.includes("node_modules/streamdown/") || id.includes("node_modules/mermaid/") || id.includes("node_modules/cytoscape/") || id.includes("node_modules/shiki/") || id.includes("node_modules/@shikijs/")) {
            return "vendor-ai-markdown";
          }
          if (id.includes("node_modules/date-fns/")) {
            return "vendor-date";
          }
          if (id.includes("node_modules/@trpc/") || id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-data";
          }
          if (id.includes("node_modules/@stripe/") || id.includes("node_modules/stripe/")) {
            return "vendor-stripe";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".vercel.app",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

---

## Troubleshooting Commands

### Build Errors

```bash
# Clean rebuild
rm -rf dist node_modules
pnpm install
pnpm build

# Check TypeScript errors
pnpm check

# Check for Manus remnants
grep -r "vite-plugin-manus" .
grep -r "manusruntime" .
grep -r "manus-computer" .
```

### Database Issues

```bash
# Test PlanetScale connection
pscale connection-string sleekinvoices production --format javascript

# Check database schema
pscale shell sleekinvoices production
> SHOW TABLES;
> DESCRIBE users;
> exit

# Check connection pooling
pscale connection-pools list sleekinvoices production
```

### Vercel Issues

```bash
# Check deployment logs
vercel logs --prod

# Inspect deployment
vercel inspect

# Redeploy without cache
vercel --prod --force

# Clear build cache
vercel build --force
```

### OAuth Issues

```bash
# Test OAuth endpoint locally
curl http://localhost:3000/api/auth/signin

# Check OAuth configuration
# Verify in Google Cloud Console
# Verify in GitHub OAuth settings
# Check OAUTH_SERVER_URL env var matches deployment URL exactly
```

---

## Quick Reference URLs

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Your project: https://vercel.com/[username]/sleekinvoices

**PlanetScale:**
- Dashboard: https://app.planetscale.com
- Docs: https://planetscale.com/docs
- Your database: https://app.planetscale.com/sleekinvoices

**Google OAuth:**
- Console: https://console.cloud.google.com/apis/credentials
- Docs: https://developers.google.com/identity/protocols/oauth2

**GitHub OAuth:**
- Settings: https://github.com/settings/developers
- Docs: https://docs.github.com/en/developers/apps/building-oauth-apps

**Auth.js:**
- Docs: https://authjs.dev/
- Reference: https://authjs.dev/reference/core

---

## One-Liner Summary

```bash
# Day 1
git checkout -b backup/pre-vercel-migration && git push origin backup/pre-vercel-migration && git checkout mystifying-neumann
# Edit package.json and vite.config.ts manually
pnpm install && pnpm build && pnpm start  # Test locally
brew install planetscale/tap/pscale && pscale auth login && pscale database create sleekinvoices --region us-east
mysqldump -h [host] -u [user] -p [db] > backup.sql
pscale shell sleekinvoices production < backup.sql
pscale connection-string sleekinvoices production --format javascript  # Copy for Vercel
openssl rand -base64 32  # Run 3 times for secrets
# Set up Google/GitHub OAuth manually
npm i -g vercel && vercel login && vercel link
# Add env vars in Vercel Dashboard
vercel  # Deploy preview

# Day 2
git checkout main && git merge mystifying-neumann && git push origin main
vercel --prod  # Deploy to production
curl https://sleekinvoices.vercel.app/api/health  # Test
```

---

**Save this document for quick command reference during migration!**
