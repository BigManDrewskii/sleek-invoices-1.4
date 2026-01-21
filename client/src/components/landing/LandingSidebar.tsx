import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, LayoutDashboard, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

interface LandingSidebarProps {
  children?: React.ReactNode;
  onNavigate?: (section: string) => void;
}

export function LandingSidebar({ children, onNavigate }: LandingSidebarProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: false,
  });

  const getSignUpUrl = () => {
    const loginUrl = getLoginUrl();
    if (loginUrl === "/") return "/";
    try {
      const url = new URL(loginUrl);
      url.searchParams.set("type", "signUp");
      return url.toString();
    } catch {
      return loginUrl;
    }
  };

  const handleNavigate = (section: string) => {
    setOpen(false);
    onNavigate?.(section);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer"
        aria-label="Open menu"
      >
        {children}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          hideCloseButton
          className="w-[85vw] max-w-sm bg-background/98 backdrop-blur-2xl border-l border-border p-0 flex flex-col"
        >
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
            <img
              src="/logos/wide/SleekInvoices-Logo-Wide.svg"
              alt="SleekInvoices"
              className="h-6 w-auto"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-auto py-4 px-3">
            <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleNavigate("features")}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all text-left"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("pricing")}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all text-left"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/docs";
                }}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all text-left"
              >
                Docs
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("faq")}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all text-left"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Footer with auth */}
          <div className="border-t border-border p-4 bg-background/98">
            {loading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : isAuthenticated ? (
              <Button className="w-full rounded-lg h-11" asChild>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full rounded-lg h-10"
                  asChild
                >
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
                <Button className="w-full rounded-lg h-10" asChild>
                  <a href={getSignUpUrl()}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
