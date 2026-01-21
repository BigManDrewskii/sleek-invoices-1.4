import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  FileText,
  Users,
  PlusCircle,
  LayoutDashboard,
  Settings,
  Receipt,
  TrendingUp,
  Repeat,
  CreditCard,
  Package,
  FileCheck,
  Palette,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string[];
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "actions" | "quick";
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Toggle command palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
      // Also close on Escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Define all available commands
  const commands: CommandItem[] = [
    // Quick Actions
    {
      id: "new-invoice",
      label: "Create New Invoice",
      shortcut: ["⌘", "N"],
      icon: <PlusCircle className="h-4 w-4" />,
      action: () => setLocation("/invoices/create"),
      category: "quick",
      keywords: ["add", "invoice", "bill", "new"],
    },
    {
      id: "magic-invoice",
      label: "Magic Invoice (AI)",
      icon: <Sparkles className="h-4 w-4 text-purple-400" />,
      action: () => {
        setLocation("/invoices/create");
        // Dispatch event to open magic input
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-magic-invoice"));
        }, 100);
      },
      category: "quick",
      keywords: ["ai", "smart", "quick", "magic", "compose"],
    },
    {
      id: "new-client",
      label: "Add New Client",
      shortcut: ["⌘", "⇧", "N"],
      icon: <Users className="h-4 w-4" />,
      action: () => {
        setLocation("/clients");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-new-client-dialog"));
        }, 100);
      },
      category: "quick",
      keywords: ["add", "client", "customer", "new"],
    },
    {
      id: "new-expense",
      label: "Add New Expense",
      shortcut: ["⌘", "⇧", "E"],
      icon: <Receipt className="h-4 w-4" />,
      action: () => {
        setLocation("/expenses");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-new-expense-dialog"));
        }, 100);
      },
      category: "quick",
      keywords: ["add", "expense", "cost", "new"],
    },
    {
      id: "new-estimate",
      label: "Create New Estimate",
      icon: <FileCheck className="h-4 w-4" />,
      action: () => setLocation("/estimates/create"),
      category: "quick",
      keywords: ["add", "estimate", "quote", "proposal", "new"],
    },

    // Navigation
    {
      id: "go-dashboard",
      label: "Go to Dashboard",
      shortcut: ["G", "D"],
      icon: <LayoutDashboard className="h-4 w-4" />,
      action: () => setLocation("/dashboard"),
      category: "navigation",
      keywords: ["home", "overview", "main"],
    },
    {
      id: "go-invoices",
      label: "Go to Invoices",
      shortcut: ["G", "I"],
      icon: <FileText className="h-4 w-4" />,
      action: () => setLocation("/invoices"),
      category: "navigation",
      keywords: ["bills", "list"],
    },
    {
      id: "go-clients",
      label: "Go to Clients",
      shortcut: ["G", "C"],
      icon: <Users className="h-4 w-4" />,
      action: () => setLocation("/clients"),
      category: "navigation",
      keywords: ["customers", "contacts"],
    },
    {
      id: "go-expenses",
      label: "Go to Expenses",
      icon: <Receipt className="h-4 w-4" />,
      action: () => setLocation("/expenses"),
      category: "navigation",
      keywords: ["costs", "spending"],
    },
    {
      id: "go-analytics",
      label: "Go to Analytics",
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => setLocation("/analytics"),
      category: "navigation",
      keywords: ["reports", "stats", "charts"],
    },
    {
      id: "go-recurring",
      label: "Go to Recurring Invoices",
      icon: <Repeat className="h-4 w-4" />,
      action: () => setLocation("/recurring-invoices"),
      category: "navigation",
      keywords: ["subscriptions", "automatic"],
    },
    {
      id: "go-payments",
      label: "Go to Payments",
      icon: <CreditCard className="h-4 w-4" />,
      action: () => setLocation("/payments"),
      category: "navigation",
      keywords: ["transactions", "money"],
    },
    {
      id: "go-products",
      label: "Go to Products",
      icon: <Package className="h-4 w-4" />,
      action: () => setLocation("/products"),
      category: "navigation",
      keywords: ["services", "items", "catalog"],
    },
    {
      id: "go-estimates",
      label: "Go to Estimates",
      icon: <FileCheck className="h-4 w-4" />,
      action: () => setLocation("/estimates"),
      category: "navigation",
      keywords: ["quotes", "proposals"],
    },
    {
      id: "go-templates",
      label: "Go to Templates",
      icon: <Palette className="h-4 w-4" />,
      action: () => setLocation("/templates"),
      category: "navigation",
      keywords: ["design", "branding"],
    },
    {
      id: "go-settings",
      label: "Go to Settings",
      icon: <Settings className="h-4 w-4" />,
      action: () => setLocation("/settings"),
      category: "navigation",
      keywords: ["preferences", "account", "profile"],
    },
  ];

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-label="Close command palette"
        role="button"
        tabIndex={-1}
      />

      {/* Command Dialog */}
      <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl px-4">
        <div
          className={cn(
            "bg-popover border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-200",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search
              className="h-5 w-5 text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            />
            <kbd className="hidden sm:inline-flex h-7 items-center gap-1.5 rounded border border-border bg-muted px-2.5 text-xs text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <Command.List className="max-h-[60vh] overflow-y-auto p-3">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="px-2 py-2.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Quick Actions
              </p>
              {commands
                .filter(cmd => cmd.category === "quick")
                .map(command => (
                  <Command.Item
                    key={command.id}
                    value={`${command.label} ${command.keywords?.join(" ") || ""}`}
                    onSelect={() => runCommand(command.action)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground transition-colors"
                  >
                    <span className="text-muted-foreground" aria-hidden="true">
                      {command.icon}
                    </span>
                    <span className="flex-1">{command.label}</span>
                    {command.shortcut && (
                      <div className="flex items-center gap-1.5">
                        {command.shortcut.map((key, i) => (
                          <kbd
                            key={i}
                            className="h-6 min-w-[22px] flex items-center justify-center rounded border border-border bg-muted px-2 text-xs text-muted-foreground"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                    {command.id === "magic-invoice" && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2.5 py-1 rounded-full">
                        AI
                      </span>
                    )}
                  </Command.Item>
                ))}
            </Command.Group>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="px-2 py-2.5 mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Navigation
              </p>
              {commands
                .filter(cmd => cmd.category === "navigation")
                .map(command => (
                  <Command.Item
                    key={command.id}
                    value={`${command.label} ${command.keywords?.join(" ") || ""}`}
                    onSelect={() => runCommand(command.action)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground transition-colors"
                  >
                    <span className="text-muted-foreground" aria-hidden="true">
                      {command.icon}
                    </span>
                    <span className="flex-1">{command.label}</span>
                    {command.shortcut && (
                      <div className="flex items-center gap-1">
                        {command.shortcut.map((key, i) => (
                          <kbd
                            key={i}
                            className="h-5 min-w-[20px] flex items-center justify-center rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                    <ArrowRight
                      className="h-3 w-3 text-muted-foreground opacity-0 group-data-[selected=true]:opacity-100"
                      aria-hidden="true"
                    />
                  </Command.Item>
                ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="h-5 px-1.5 rounded border border-border bg-muted">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="h-5 px-1.5 rounded border border-border bg-muted">
                  ↵
                </kbd>
                Select
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              <kbd className="px-2 py-1 rounded border border-border bg-muted">
                ⌘K
              </kbd>{" "}
              to toggle
            </span>
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}
