import { Check } from "lucide-react";
import { LandingButton } from "./LandingButton";
import { getLoginUrl } from "@/const";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl p-5 ${
        highlighted
          ? "bg-primary/5 border-2 border-primary/30"
          : "bg-card border border-border"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {badge}
          </span>
        </div>
      )}
      <div className="text-center mb-5">
        <h3 className="text-base font-medium text-foreground mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-3xl font-bold text-foreground">{price}</span>
          <span className="text-xs text-muted-foreground">/{period}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <ul className="space-y-2 mb-5">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <LandingButton
        href={ctaHref}
        variant={highlighted ? "primary" : "outline"}
        className={`w-full rounded-full ${
          !highlighted ? "bg-white/10 hover:bg-white/20 text-white" : ""
        }`}
        showIcon={false}
      >
        {cta}
      </LandingButton>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 uppercase tracking-tight">
            Simple pricing
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Start free, upgrade when ready
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            description="Perfect for getting started"
            features={[
              "3 invoices per month",
              "Client management",
              "PDF generation",
              "Email sending",
              "Basic analytics",
            ]}
            cta="Start Free"
            ctaHref={getLoginUrl()}
          />
          <PricingCard
            name="Pro"
            price="$12"
            period="per month"
            description="Everything unlimited"
            badge="Popular"
            features={[
              "Unlimited invoices",
              "Unlimited clients",
              "Stripe + Crypto payments",
              "Auto payment reminders",
              "Recurring invoices",
              "QuickBooks sync",
              "AI Magic Invoice",
              "Priority support",
            ]}
            cta="Start Free Trial"
            ctaHref={getLoginUrl()}
            highlighted
          />
        </div>
      </div>
    </section>
  );
}
