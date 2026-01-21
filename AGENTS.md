# AGENTS.md

This file provides guidance for AI coding agents operating in this repository.

## Commands

### Development

```bash
# Install dependencies
pnpm install

# Run development server (auto-restarts on changes)
pnpm dev

# Type check
pnpm check

# Format code
pnpm format
```

### Database

```bash
# Generate and run migrations
pnpm db:push

# Audit database schema for issues
pnpm db:audit

# Sync schema changes (development)
pnpm db:sync

# Seed database with test data (local dev only)
pnpm seed

# Reset user data (development)
pnpm db:reset
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/templates.test.ts

# Run tests matching a pattern
pnpm test --testNamePattern="invoice"
```

### Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Code Style Guidelines

### Imports

- Use absolute imports with `@` prefix for client code: `import { api } from "@/lib/trpc"`
- Use relative imports for server code: `import { db } from "../db"`
- Group imports: external libs → internal → relative

### Formatting

- Prettier handles formatting; run `pnpm format` before committing
- Use Tailwind CSS utility classes for styling
- Avoid custom CSS unless absolutely necessary

### Types

- No `any` without explicit justification; prefer `unknown`
- Avoid `as`, `@ts-ignore`, `@ts-expect-error`
- Use Zod for runtime validation (frontend forms, API inputs)

### Naming Conventions

- Components: PascalCase (e.g., `InvoiceEditor.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useInvoice.ts`)
- Utilities: camelCase (e.g., `decimalMath.ts`)
- Database columns: snake_case
- API procedures: camelCase
- Test files: `.test.ts` or `.spec.ts` suffix

### Error Handling

- Always wrap async operations in try/catch
- Throw trpc errors with `throw new TRPCError({ code: ..., message: ... })`
- Never leave empty catch blocks
- Log errors appropriately before throwing

### Database

- Use Drizzle ORM query builder, never raw SQL in routers
- Keep queries in `server/db.ts`, not inline in routers
- Run `pnpm db:push` after any schema change
- Use transactions for multi-table operations

### Security

- Validate all user input with Zod schemas
- Use `protectedProcedure` for authenticated routes
- Never expose API keys in frontend code
- Verify webhook signatures (Stripe, etc.)
- Sanitize user-generated content before rendering

### Performance

- Lazy load heavy components (AI, charts)
- Use pagination for large lists
- Add skeleton loaders for async data
- Optimize images before S3 upload
- Avoid `any` to maintain type safety and tree-shaking

### Testing

- Write tests for all new API procedures
- Test invoice calculations (decimal precision)
- Test subscription limit enforcement
- Create test files in `server/` with `.test.ts` extension
- Run `pnpm test` before committing changes

## Project Structure

```
sleekinvoices-backup/
├── client/src/          # Frontend React application
├── server/              # Backend server code
│   ├── routers/         # tRPC routers
│   ├── db.ts           # Database configuration
│   └── *.test.ts       # Test files
├── shared/             # Shared types and utilities
├── attached_assets/    # Static assets
├── drizzle.config.ts   # Drizzle ORM configuration
├── vite.config.ts      # Vite bundler configuration
└── vitest.config.ts    # Vitest configuration
```

## Import Aliases

```json
{
  "@/*": "./client/src/*",
  "@shared/*": "./shared/*"
}
```

---

## Spacing System - MANDATORY REFERENCE

This spacing system prevents text-from-border issues and ensures visual consistency. Always use these values.

### Spacing Scale (px)

| Token    | Value | Use For                              |
| -------- | ----- | ------------------------------------ |
| `px-2`   | 8px   | Icon containers, tight gaps          |
| `px-2.5` | 10px  | Keyboard shortcuts, small tags       |
| `px-3`   | 12px  | Code blocks, form inputs             |
| `px-4`   | 16px  | Standard button padding, small cards |
| `px-5`   | 20px  | Modal content, section containers    |
| `px-6`   | 24px  | Card content, dialog headers         |
| `px-7`   | 28px  | Large dialogs, page containers       |

| Token    | Value | Use For                                   |
| -------- | ----- | ----------------------------------------- |
| `py-1`   | 4px   | Badge vertical (use `py-1`, NOT `py-0.5`) |
| `py-1.5` | 6px   | Table headers, compact labels             |
| `py-2`   | 8px   | Form rows, list items                     |
| `py-2.5` | 10px  | Medium compact sections                   |
| `py-3`   | 12px  | Subtotal rows, divider lines              |
| `py-4`   | 16px  | Standard section padding                  |
| `py-5`   | 20px  | Card interiors, modal bodies              |
| `py-6`   | 24px  | Large card interiors                      |

| Token     | Value | Use For                                 |
| --------- | ----- | --------------------------------------- |
| `gap-1`   | 4px   | Icon-to-text (use `gap-1.5` or `gap-2`) |
| `gap-1.5` | 6px   | Badge icon-to-text                      |
| `gap-2`   | 8px   | Standard component gap                  |
| `gap-2.5` | 10px  | Form label-to-input                     |
| `gap-3`   | 12px  | Section-level gaps                      |
| `gap-4`   | 16px  | Major section separators                |
| `gap-5`   | 20px  | Page section spacing                    |

| Token         | Value | Use For                  |
| ------------- | ----- | ------------------------ |
| `space-y-1`   | 4px   | NEVER USE - too tight    |
| `space-y-1.5` | 6px   | Compact lists            |
| `space-y-2`   | 8px   | Form fields, tight lists |
| `space-y-2.5` | 10px  | Medium density           |
| `space-y-3`   | 12px  | Standard form spacing    |
| `space-y-4`   | 16px  | Card content items       |
| `space-y-5`   | 20px  | Modal section spacing    |
| `space-y-6`   | 24px  | Major sections           |

---

### Component Padding Standards

#### Dialog/Modal Content

```tsx
// DialogContent
className = "sm:max-w-[550px] px-5 md:px-7";

// DialogHeader
className = "pb-4 px-0";

// DialogBody (content wrapper)
className = "space-y-6 px-0";

// DialogFooter
className = "pt-6 px-0";
```

#### Cards

```tsx
// Standard card
<Card className="p-5 md:p-6">
  <CardHeader className="px-0 pt-0 pb-4">...</CardHeader>
  <CardContent className="px-0">...</CardContent>
</Card>
```

#### Section Containers (info boxes, alerts)

```tsx
// Small alert/warning
<div className="p-3 rounded-lg border ...">...</div>

// Medium alert/section
<div className="p-4 rounded-xl border ...">...</div>

// Large section (amount cards, payment details)
<div className="p-5 rounded-xl border bg-card">...</div>
```

#### Details Grid (label-value pairs)

```tsx
// Grid layout for details
<div className="grid grid-cols-2 gap-x-8 gap-y-5">
  <div className="space-y-2.5">
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
      <div className="p-1.5 rounded-md bg-muted/60">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs uppercase tracking-wider font-medium">
        Label
      </span>
    </div>
    <p className="font-medium text-base pl-9">Value</p>
  </div>
</div>
```

---

### NEVER Use These Patterns

| Bad Pattern            | Problem                        | Fix                      |
| ---------------------- | ------------------------------ | ------------------------ |
| `py-0.5`               | Text touches border vertically | `py-1` minimum           |
| `p-2` on alerts        | Text feels cramped             | `p-3` or `p-4`           |
| `gap-1` on badges      | Icon-text too close            | `gap-1.5` or `gap-2`     |
| `space-y-1`            | Items stacked too tight        | `space-y-2` minimum      |
| `text-xs` on codes     | Hard to read                   | `text-sm` minimum        |
| `text-xs` on labels    | Underscored importance         | `text-sm` with uppercase |
| `p-0` with `border`    | Content touches border         | Add padding to children  |
| `px-4` on large modals | Sides feel tight               | `px-5 md:px-7`           |

---

### Quick Reference Copy-Paste

#### Payment/Amount Card

```tsx
<div className="flex items-center justify-between p-5 rounded-xl border bg-card">
  <div>
    <p className="text-sm text-muted-foreground mb-1.5">Label</p>
    <p className="text-2xl font-bold text-foreground">Value</p>
  </div>
  <Badge variant="success">Status</Badge>
</div>
```

#### Detail Row with Icon

```tsx
<div className="space-y-2.5">
  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
    <div className="p-1.5 rounded-md bg-muted/60">
      <Icon className="h-4 w-4" />
    </div>
    <span className="text-xs uppercase tracking-wider font-medium">LABEL</span>
  </div>
  <p className="font-medium text-base pl-9">Value</p>
</div>
```

#### Code/Hash Display

```tsx
<div className="flex items-center gap-3">
  <code className="text-sm bg-muted px-3 py-2 rounded-lg font-mono flex-1 truncate">
    {value}
  </code>
  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
    <Copy className="h-4 w-4" />
  </Button>
</div>
```

#### Section Header

```tsx
<div className="flex items-center gap-3 text-sm font-semibold">
  <div className="p-2 rounded-lg bg-muted">
    <Icon className="h-4 w-4" />
  </div>
  <span>Section Name</span>
</div>
```
