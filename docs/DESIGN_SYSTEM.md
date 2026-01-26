# Design System Documentation

This document outlines the standardized design patterns, spacing tokens, and component specifications for the SleekInvoices application.

## Spacing Scale

All spacing should use Tailwind's standard scale. Arbitrary `px` values should be avoided.

| Token | Value | Tailwind                       | Usage                       |
| ----- | ----- | ------------------------------ | --------------------------- |
| `xs`  | 4px   | `space-y-1`, `p-1`, `gap-1`    | Tight elements, badges      |
| `sm`  | 8px   | `space-y-2`, `p-2`, `gap-2`    | Compact spacing             |
| `md`  | 16px  | `space-y-4`, `p-4`, `gap-4`    | **Standard** - most spacing |
| `lg`  | 24px  | `space-y-6`, `p-6`, `gap-6`    | Section spacing             |
| `xl`  | 32px  | `space-y-8`, `p-8`, `gap-8`    | Major sections              |
| `2xl` | 48px  | `space-y-12`, `p-12`, `gap-12` | Page sections               |
| `3xl` | 64px  | `space-y-16`, `p-16`, `gap-16` | Hero sections               |

## Typography Scale

| Element       | Tailwind                                                            | Usage                      |
| ------------- | ------------------------------------------------------------------- | -------------------------- |
| Page Title    | `text-2xl sm:text-3xl font-bold tracking-tight`                     | Page headers               |
| Section Title | `text-xl sm:text-2xl font-semibold tracking-tight`                  | Card titles, sections      |
| Subsection    | `text-base sm:text-lg font-medium tracking-tight`                   | Subsections                |
| Body Large    | `text-base text-foreground`                                         | Primary content            |
| Body          | `text-sm text-muted-foreground`                                     | Standard text              |
| Caption       | `text-xs text-muted-foreground`                                     | Metadata, labels           |
| Label         | `text-xs font-medium uppercase tracking-wide text-muted-foreground` | Form labels, table headers |

### Typography Components

```tsx
import { PageTitle, SectionTitle, SubsectionTitle, BodyText, CaptionText, FormLabel, TableHeader } from "@/components/ui/typography";

<PageTitle>Dashboard</PageTitle>
<SectionTitle>Recent Invoices</SectionTitle>
<FormLabel required>Email</FormLabel>
<TableHeader>Status</TableHeader>
```

## Button Components

### Sizes (use consistently)

| Size      | Tailwind                                | Use Case                        |
| --------- | --------------------------------------- | ------------------------------- |
| `sm`      | `h-8 px-3 py-1.5 text-xs rounded-md`    | Table actions, compact toolbars |
| `default` | `h-9 px-4 py-2 rounded-lg`              | **Standard** - most buttons     |
| `lg`      | `h-11 px-6 py-2.5 text-base rounded-lg` | Primary CTAs, form submits      |
| `xl`      | `h-12 px-8 py-3 text-base rounded-xl`   | Hero CTAs                       |
| `icon`    | `size-9 rounded-lg`                     | Icon-only buttons               |
| `icon-sm` | `size-10 rounded-md`                    | Small icon buttons              |

### Variants

| Variant       | Tailwind                           | Usage             |
| ------------- | ---------------------------------- | ----------------- |
| `default`     | bg-primary text-primary-foreground | Primary actions   |
| `secondary`   | bg-secondary                       | Secondary actions |
| `outline`     | border border-border               | Subtle actions    |
| `ghost`       | bg-transparent                     | Minimal actions   |
| `destructive` | bg-destructive                     | Delete, cancel    |
| `success`     | bg-green-600                       | Success actions   |

## Card Components

### Base Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Card content here</CardContent>
</Card>;
```

### Card Specifications

| Property      | Tailwind                    | Notes              |
| ------------- | --------------------------- | ------------------ |
| Border Radius | `rounded-xl`                | Standard cards     |
| Padding       | `py-4 md:py-6 px-4 md:px-6` | Responsive padding |
| Background    | `bg-card`                   | With design token  |
| Border        | `border border-border`      | Subtle border      |
| Shadow        | `shadow-sm`                 | Subtle shadow      |

### Stat Cards (Dashboard)

Stat cards use intentional差异化 design:

- `rounded-2xl` for visual distinction
- Gradient backgrounds: `bg-gradient-to-br from-card to-card/80`
- Larger padding: `p-5`

## Modal/Dialog Components

### Standard Modal Structure

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogBody, DialogActions } from "@/components/shared/DialogPatterns";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    <DialogBody spacing="default">{/* Content */}</DialogBody>
    <DialogActions
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
      submitText="Confirm"
      cancelText="Cancel"
    />
  </DialogContent>
</Dialog>;
```

### Modal Width Standards

| Width    | Tailwind           | Use Case               |
| -------- | ------------------ | ---------------------- |
| Small    | `sm:max-w-[420px]` | Simple confirmations   |
| Standard | `sm:max-w-[500px]` | Most forms             |
| Medium   | `sm:max-w-[550px]` | Detailed content       |
| Large    | `sm:max-w-[600px]` | Complex/wizard dialogs |
| Full     | `max-w-5xl`        | Full previews          |

### Dialog Patterns

The codebase provides standardized patterns in `@/components/shared/DialogPatterns.tsx`:

- `DialogIconHeader(icon, title, variant, size)` - Icon + title header
- `DialogBody(spacing, className)` - Content area with consistent spacing
- `DialogActions(onClose, onSubmit, ...)` - Footer with button group

## Form Components

### Standard Form Field Pattern

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div className="space-y-2">
  <Label htmlFor="email">
    Email <span className="text-destructive">*</span>
  </Label>
  <Input
    id="email"
    type="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    className={error ? "border-destructive" : ""}
    aria-invalid={!!error}
  />
  {error && <p className="text-sm text-destructive">{error}</p>}
</div>;
```

### Form Specifications

| Property        | Tailwind                                                            | Notes               |
| --------------- | ------------------------------------------------------------------- | ------------------- |
| Label-Input Gap | `space-y-2`                                                         | 8px                 |
| Label Style     | `text-xs font-medium uppercase tracking-wide text-muted-foreground` |                     |
| Input Height    | `h-10`                                                              | 40px touch-friendly |
| Error Message   | `text-sm text-destructive`                                          | With `role="alert"` |

### Error Handling Pattern

```tsx
// Conditional border
<Input className={error ? "border-destructive" : ""} />

// Aria attributes
<Input aria-invalid={!!error} aria-describedby={error ? "field-error" : undefined} />

// Error message
{error && (
  <p id="field-error" className="text-sm text-destructive" role="alert">
    {error}
  </p>
)}
```

## Table Components

### Standard Table Structure

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

### Table Specifications

| Element            | Tailwind                                                            | Notes               |
| ------------------ | ------------------------------------------------------------------- | ------------------- |
| Cell Padding       | `p-3 md:p-4`                                                        | Responsive          |
| Header Style       | `text-xs font-medium uppercase tracking-wide text-muted-foreground` |                     |
| Checkbox Alignment | `translate-y-0.5`                                                   | Fine-tune alignment |

## Design Tokens

### Colors

Colors use CSS variables from the design system:

- `bg-primary`, `text-primary-foreground`
- `bg-card`, `text-card-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`, `border-destructive`
- `shadow-sm`, `shadow-lg`

### Font Families

- Headings: `var(--font-sans)` - "Google Sans Flex"
- Body: `var(--font-body)` - "DM Sans"
- Numeric: `var(--font-numeric)` - "SUSE Mono"
- Code: `var(--font-mono)` - "Atkinson Hyperlegible Mono"

## Common Patterns

### Responsive Design

- Mobile-first approach
- `sm:`, `md:`, `lg:` prefixes for breakpoints
- `hidden md:block` for hiding/showing elements

### Focus States

- `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`
- `focus-visible:outline-none`

### Transitions

- Standard: `transition-all duration-150 ease-out`
- Interactive: `transition-all duration-200`

## Anti-Patterns to Avoid

1. **Arbitrary px values** - Use Tailwind scale instead
2. **Inconsistent button sizes** - Stick to standard sizes
3. **Manual error styling** - Use `border-destructive` and `text-destructive`
4. **Hardcoded colors** - Use design tokens (`bg-card`, not `bg-white`)
5. **Inline styles for layout** - Use Tailwind classes

## File Organization

```
/client/src/components/ui/
├── button.tsx          # Button with variants
├── card.tsx            # Card components
├── dialog.tsx          # Base dialog primitives
├── form.tsx            # React-hook-form integration
├── form-field.tsx      # Simple form wrapper
├── input.tsx           # Text inputs
├── label.tsx           # Form labels
├── select.tsx          # Select dropdowns
├── table.tsx           # Table components
├── textarea.tsx        # Textarea
└── typography.tsx      # Text styling components

/client/src/components/shared/
└── DialogPatterns.tsx  # Standardized dialog patterns
```

## References

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Class Variance Authority](https://github.com/clsx/cva)
