# SleekInvoices - Professional Invoice Generator

A modern, elegant invoice generator built to compete with FreshBooks, offering superior UX with a focus on simplicity and value.

## 🎯 Project Vision

**Goal:** Create a cheaper, faster, more elegant alternative to FreshBooks for freelancers and small businesses.

**Target Pricing:**

- Free: 3 invoices/month
- Pro: $12/month (vs. FreshBooks $15-65/month)

**Competitive Advantages:**

- 80% cheaper than FreshBooks
- Native Stripe integration (no separate accounts)
- Modern, fast, elegant UI
- Simple and focused (no bloat)
- Easy cancellation (no lock-in)
- AI-powered invoice creation and categorization

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React 19 + TypeScript + TailwindCSS 4 + Vite
- **Backend:** Express + tRPC 11 + Drizzle ORM
- **Database:** MySQL/TiDB
- **Payments:** Stripe (payment links + subscriptions)
- **PDF:** Puppeteer
- **Email:** Resend
- **Storage:** S3 (for PDFs and logos)
- **Auth:** Manus OAuth
- **AI:** OpenAI integration for smart invoice creation

### Database Schema (43 tables)

**Core Tables:**

- `users` - User accounts with company info and subscription status
- `clients` - Client database for invoice recipients
- `invoices` - Invoice records with financial calculations
- `invoiceLineItems` - Line items for each invoice
- `estimates` - Quote and proposal records
- `recurringInvoices` - Automated recurring billing
- `expenses` - Business expense tracking
- `products` - Products & services catalog

**Supporting Tables:**

- `emailLog` - Email sending history with delivery tracking
- `reminderLogs` - Payment reminder history
- `auditLogs` - User action audit trail
- `aiCredits` - AI feature usage credits
- `aiUsageLogs` - AI feature usage tracking
- `invoiceTemplates` - PDF template designs
- `clientPortalAccess` - Client portal access tokens

**Integration Tables:**

- `stripeCustomers` - Stripe customer records
- `stripeSubscriptions` - Subscription records
- `stripeInvoices` - Stripe invoice references
- `quickbooksTokens` - QuickBooks sync tokens

## ✅ What's Implemented

### Backend (90% Complete)

**Database Layer (`server/db.ts`):**

- ✅ User management (upsert, get by ID/OpenID)
- ✅ Client CRUD operations with existence validation
- ✅ Invoice CRUD operations with existence checks
- ✅ Estimate CRUD operations
- ✅ Recurring invoice CRUD operations
- ✅ Expense CRUD operations with tax deductibility tracking
- ✅ Product/service catalog management
- ✅ Analytics queries (stats, monthly revenue, top clients)
- ✅ Email logging with delivery tracking
- ✅ Reminder system with automated schedules
- ✅ AI credits and usage tracking
- ✅ Audit logging for all actions

**API Layer (`server/routers.ts`):**

- ✅ Auth routes (me, logout)
- ✅ User routes (profile, update, logo upload, subscription)
- ✅ Client routes (list, get, create, update, delete)
- ✅ Invoice routes (list, get, create, update, delete, generate PDF, create payment link, send email, send reminder)
- ✅ Estimate routes (list, get, create, update, delete, convert to invoice)
- ✅ Recurring invoice routes (list, get, create, update, delete, pause/resume)
- ✅ Expense routes (list, get, create, update, delete, categorize)
- ✅ Product routes (list, get, create, update, delete)
- ✅ Email history routes (list with filters)
- ✅ Reminder routes (get logs, create, update, delete)
- ✅ Analytics routes (stats, monthly revenue, dashboard metrics)
- ✅ Subscription routes (status, create checkout, customer portal)

**Utilities:**

- ✅ Stripe integration - Payment links, subscriptions, customer portal
- ✅ PDF generation - Professional invoice templates with custom branding
- ✅ Email sending - Invoice emails, payment reminders via Resend
- ✅ AI integration - Smart invoice creation and expense categorization
- ✅ QuickBooks sync - OAuth-based accounting integration

### Frontend (75% Complete)

**Completed Pages:**

- ✅ Dashboard with stats, monthly usage, quick actions
- ✅ Invoices list with filters, search, and bulk actions
- ✅ Create Invoice with guided wizard and standard form
- ✅ Edit Invoice with all fields
- ✅ View Invoice with PDF, email, payment link actions
- ✅ Estimates list with status tracking
- ✅ Create Estimate and Edit Estimate
- ✅ Recurring Invoices management with pause/resume
- ✅ Payments tracking with Stripe integration
- ✅ Clients list with quick actions
- ✅ Client detail view with invoice history
- ✅ Expenses tracking with categorization
- ✅ Products catalog management
- ✅ Analytics with revenue charts
- ✅ Email History with delivery status
- ✅ Templates gallery
- ✅ Settings (profile, company, branding)
- ✅ Subscription management
- ✅ Docs and FAQ pages

**Components:**

- ✅ Navigation with responsive design
- ✅ Data tables with sorting and filtering
- ✅ Form components with validation
- ✅ Modal dialogs
- ✅ Toast notifications
- ✅ Theme system (light/dark)
- ✅ Status badges
- ✅ User avatar and menu

## 🚀 Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Seed database with test data (optional)
node scripts/seed-complete.mjs

# Start dev server
pnpm dev
```

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Type checking
pnpm format       # Format code with Prettier
pnpm db:push      # Sync schema changes
pnpm db:audit     # Audit database schema
pnpm db:sync      # Sync schema (development)
pnpm db:reset     # Reset user data
pnpm seed         # Seed database
pnpm test         # Run tests
```

### Environment Variables

Required secrets:

- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `RESEND_API_KEY` - Resend email API key
- `OPENAI_API_KEY` - OpenAI API key for AI features

System-provided:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth app ID
- `OAUTH_SERVER_URL` - OAuth backend URL

## 📁 Project Structure

```
sleekinvoices/
├── client/src/
│   ├── pages/              # Page components (Dashboard, Invoices, etc.)
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities (tRPC client, utils)
│   ├── contexts/           # React contexts
│   ├── _core/              # Core hooks and utilities
│   └── styles/             # CSS styles and design system
├── server/
│   ├── routers.ts          # tRPC API routes
│   ├── db.ts               # Database queries and utilities
│   ├── stripe.ts           # Stripe integration
│   ├── pdf.ts              # PDF generation
│   ├── email.ts            # Email sending
│   ├── _core/              # Framework code (tRPC, auth)
│   └── routers/            # Route handlers
├── drizzle/
│   └── schema.ts           # Database schema
├── shared/                 # Shared types
├── scripts/
│   └── seed-complete.mjs   # Database seeding script
└── AGENTS.md               # AI agent guidelines
```

## 🎨 Design System

**Spacing System:**

- Consistent spacing tokens (px-2 through px-7, py-1 through py-6)
- gap-1 through gap-5 for component gaps
- space-y-1.5 through space-y-6 for vertical rhythm

**Component Standards:**

- Cards: `p-5 md:p-6` with `px-0` for header/content
- Modals: `px-5 md:px-7` for content, `py-5` for body
- Forms: `space-y-5` for vertical spacing
- Buttons: minimum 44px touch targets
- Tables: responsive with card view on mobile

**Colors:**

- Primary: Professional indigo
- Background: Clean white/dark gray
- Status: Semantic colors (success, warning, error, info)

## 🔐 Security

- OAuth authentication via Manus
- JWT session cookies (httpOnly, secure)
- SQL injection protection (Drizzle ORM)
- XSS protection (React escaping)
- CSRF protection (SameSite cookies)
- Stripe webhook signature verification
- Input validation with Zod schemas
- Protected procedures for authenticated routes

## 📊 Business Model

**Free Tier:**

- 3 invoices per month
- All core features
- AI invoice creation (limited)
- Basic templates

**Pro Tier ($12/month):**

- Unlimited invoices
- Unlimited clients
- Stripe payment links
- Auto reminders
- Custom branding
- Full AI features
- Priority support
- QuickBooks sync

## 🎯 Success Metrics

**Product Metrics:**

- Time to first invoice: < 5 minutes
- Invoice send success rate: > 95%
- Payment link conversion: > 30%
- User retention (30-day): > 60%

**Business Metrics:**

- Free to paid conversion: > 10%
- Churn rate: < 5% monthly
- Customer acquisition cost: < $50
- Lifetime value: > $500

## 🤝 Contributing

This is a solo project. Not accepting contributions at this time.

---

**Built with speed and precision to ship fast and win customers.**
