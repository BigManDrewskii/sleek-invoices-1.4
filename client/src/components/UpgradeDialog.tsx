import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Check,
  Sparkles,
  FileText,
  Users,
  BarChart3,
  Palette,
  Zap,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@shared/subscription";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "invoice_limit" | "feature_locked";
  currentUsage?: number;
}

export function UpgradeDialog({
  open,
  onOpenChange,
  reason = "invoice_limit",
  currentUsage,
}: UpgradeDialogProps) {
  const handleUpgrade = () => {
    window.location.href = "/subscription";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {reason === "invoice_limit"
              ? `You've used all ${SUBSCRIPTION_PLANS.FREE.invoiceLimit} free invoices this month. Upgrade to Pro for unlimited invoices.`
              : "This is a Pro feature. Upgrade to unlock all premium capabilities."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <FileText className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">Unlimited invoices</span>
                <p className="text-xs text-muted-foreground">
                  Never worry about monthly limits again
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <Users className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">Unlimited clients</span>
                <p className="text-xs text-muted-foreground">
                  Scale your business without restrictions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <CreditCard className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">
                  Stripe payment links
                </span>
                <p className="text-xs text-muted-foreground">
                  Accept card payments directly from invoices
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <BarChart3 className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">Analytics dashboard</span>
                <p className="text-xs text-muted-foreground">
                  Track revenue and business insights
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <Palette className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">Custom branding</span>
                <p className="text-xs text-muted-foreground">
                  Add your logo and customize colors
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-6 items-center justify-center rounded-md bg-muted shrink-0 mt-0.5">
                <Zap className="size-3.5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-medium">Priority support</span>
                <p className="text-xs text-muted-foreground">
                  Get help faster when you need it
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted/50 border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Pro Plan</span>
                <p className="text-xs text-muted-foreground">Billed monthly</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  ${SUBSCRIPTION_PLANS.PRO.price}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="gap-2">
            <CreditCard className="size-4" />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
