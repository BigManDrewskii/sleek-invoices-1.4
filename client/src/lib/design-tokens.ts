/**
 * Design Tokens - Single source of truth for all design decisions
 * Import and use these instead of hardcoded Tailwind classes
 */

export const designTokens = {
  colors: {
    primary: {
      DEFAULT: "bg-indigo-600",
      text: "text-indigo-600",
      foreground: "text-white",
      hover: "hover:bg-indigo-700",
      light: "bg-indigo-500",
      lighter: "bg-indigo-400",
      bg: "bg-indigo-600",
      border: "border-indigo-600",
    },
    secondary: {
      DEFAULT: "bg-slate-100",
      text: "text-slate-600",
      foreground: "text-slate-900",
      hover: "hover:bg-slate-200",
    },
    success: {
      DEFAULT: "bg-green-600",
      text: "text-green-600",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      bgLight: "bg-green-600/10",
      border: "border-green-600/20",
    },
    warning: {
      DEFAULT: "bg-amber-600",
      text: "text-amber-600",
      bg: "bg-amber-600",
      hover: "hover:bg-amber-700",
      bgLight: "bg-amber-600/10",
      border: "border-amber-600/20",
    },
    error: {
      DEFAULT: "bg-red-600",
      text: "text-red-600",
      bg: "bg-red-600",
      hover: "hover:bg-red-700",
      bgLight: "bg-red-600/10",
      border: "border-red-600/20",
    },
    info: {
      DEFAULT: "bg-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      bgLight: "bg-blue-600/10",
      border: "border-blue-600/20",
    },
    muted: {
      DEFAULT: "bg-muted",
      text: "text-muted-foreground",
      bg: "bg-muted/50",
    },
  },
  spacing: {
    card: {
      padding: "p-6",
      gap: "gap-6",
    },
    modal: {
      padding: "px-5 md:px-7 pb-6 md:pb-7",
      header: "px-5 md:px-7 pt-5 md:pt-7 pb-3 md:pb-4",
      footer: "px-5 md:px-7 py-4 md:py-5 border-t border-border bg-muted/30",
    },
    form: {
      fieldGap: "space-y-2",
      sectionGap: "space-y-5",
      sectionGapLarge: "space-y-6",
    },
    section: {
      marginBottom: "mb-8",
      gap: "space-y-6",
    },
    container: {
      padding: "px-4 sm:px-6 lg:px-8",
      maxWidth: "max-w-7xl",
    },
  },
  typography: {
    h1: "text-3xl font-bold",
    h2: "text-xl font-semibold",
    h3: "text-lg font-semibold",
    h4: "text-base font-semibold",
    body: "text-sm",
    bodySmall: "text-sm text-muted-foreground",
    label: "text-sm font-medium",
    caption: "text-xs text-muted-foreground",
    captionBold: "text-xs font-medium text-muted-foreground",
    code: "font-mono text-sm",
  },
  components: {
    button: {
      base: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 ease-out active:scale-[0.98] active:transition-none disabled:pointer-events-none disabled:opacity-40 disabled:scale-100 select-none cursor-pointer",
      focus:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      sizes: {
        sm: "h-8 px-3 py-1.5 text-xs",
        md: "h-9 px-4 py-2 text-sm",
        lg: "h-11 px-6 py-2.5 text-base",
        xl: "h-12 px-8 py-3 text-base",
      },
      variants: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline:
          "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50",
        ghost: "text-slate-700 hover:bg-slate-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-lg",
      },
    },
    input: {
      base: "flex h-10 w-full min-w-0 rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-xs transition-all duration-150 ease-out placeholder:text-muted-foreground",
      focus:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
      error:
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      disabled:
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
      dark: "dark:bg-input/30 dark:hover:bg-input/50",
    },
    card: {
      base: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
      variants: {
        default: "bg-card border border-border shadow-sm",
        elevated:
          "border border-border shadow-md hover:shadow-lg transition-shadow duration-200",
        accent: "bg-indigo-500/5 border-indigo-500/20",
        outline: "bg-transparent border-2 border-border",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    dialog: {
      overlay:
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
      content:
        "fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] px-5 md:px-7 pb-6 md:pb-7 grid gap-0 rounded-xl border border-border bg-card shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] duration-200 ease-out sm:max-w-lg",
      header:
        "flex flex-col gap-2 text-center sm:text-left px-5 md:px-7 pt-5 md:pt-7 pb-3 md:pb-4",
      footer:
        "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3 px-5 md:px-7 py-4 md:py-5 border-t border-border bg-muted/30 rounded-b-xl",
    },
    table: {
      container: "relative w-full overflow-x-auto",
      table: "w-full caption-bottom text-sm",
      thead: "[&_tr]:border-b",
      tbody: "[&_tr:last-child]:border-0",
      row: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      head: "text-foreground h-auto px-3 py-3 text-left align-middle font-medium whitespace-nowrap md:px-4 md:py-4 [&:has([role=checkbox])]:pr-0",
      cell: "p-3 align-middle whitespace-nowrap md:p-4 [&:has([role=checkbox])]:pr-0",
    },
    badge: {
      base: "inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1.5 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    },
  },
  status: {
    draft: "bg-slate-500/10 text-slate-400",
    sent: "bg-blue-500/10 text-blue-400",
    paid: "bg-green-500/10 text-green-400",
    overdue: "bg-red-500/10 text-red-400",
    canceled: "bg-slate-500/10 text-slate-500",
    processing: "bg-amber-500/10 text-amber-400",
    pending: "bg-orange-500/10 text-orange-400",
    failed: "bg-red-500/10 text-red-400",
  },
  shadows: {
    xs: "shadow-xs",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },
  borderRadius: {
    sm: "rounded-md",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  },
} as const;

// Helper function to combine classes (matches clsx/tailwind-merge pattern)
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
