import { Check, X } from "lucide-react";
import { LandingButton } from "./LandingButton";
import { getLoginUrl } from "@/const";

interface ComparisonRowProps {
  feature: string;
  sleek: boolean | string;
  freshbooks: boolean | string;
  quickbooks: boolean | string;
  wave: boolean | string;
  highlight?: boolean;
}

function ComparisonRow({
  feature,
  sleek,
  freshbooks,
  quickbooks,
  wave,
  highlight = false,
}: ComparisonRowProps) {
  const renderValue = (value: boolean | string) => {
    if (value === true)
      return (
        <Check
          className="h-5 w-5 text-green-500 mx-auto"
          aria-label="Included"
        />
      );
    if (value === false)
      return (
        <X
          className="h-5 w-5 text-muted-foreground/50 mx-auto"
          aria-label="Not included"
        />
      );
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <tr className={`border-b border-border ${highlight ? "bg-primary/5" : ""}`}>
      <th
        scope="row"
        className="py-3 px-4 text-sm text-foreground/80 font-normal text-left"
      >
        {feature}
      </th>
      <td className="py-3 px-4 text-center">{renderValue(sleek)}</td>
      <td className="py-3 px-4 text-center">{renderValue(freshbooks)}</td>
      <td className="py-3 px-4 text-center">{renderValue(quickbooks)}</td>
      <td className="py-3 px-4 text-center">{renderValue(wave)}</td>
    </tr>
  );
}

interface MobileComparisonItemProps {
  feature: string;
  sleek: boolean | string;
  competitorNote?: string;
  highlight?: boolean;
}

function MobileComparisonItem({
  feature,
  sleek,
  competitorNote,
  highlight = false,
}: MobileComparisonItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {sleek === true ? (
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : typeof sleek === "string" ? (
              <span className="text-xs font-medium text-foreground bg-primary/10 px-1.5 py-0.5 rounded">
                {sleek}
              </span>
            ) : null}
          </div>
          <span className="text-sm font-medium text-foreground">{feature}</span>
          {competitorNote && (
            <p className="text-xs text-muted-foreground mt-1">
              {competitorNote}
            </p>
          )}
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
          SLEEK
        </span>
      </div>
    </div>
  );
}

const comparisonFeatures = [
  {
    feature: "Unlimited Invoices",
    sleek: true,
    competitorNote: "FreshBooks: Premium only",
  },
  {
    feature: "Unlimited Clients",
    sleek: true,
    competitorNote: "FreshBooks: 5 on Lite",
  },
  {
    feature: "Crypto Payments",
    sleek: true,
    competitorNote: "Not available on competitors",
    highlight: true,
  },
  {
    feature: "QuickBooks Sync",
    sleek: true,
    competitorNote: "FreshBooks: Not available",
    highlight: true,
  },
  {
    feature: "AI Invoice Creation",
    sleek: true,
    competitorNote: "Not available on competitors",
    highlight: true,
  },
  { feature: "Auto Reminders", sleek: true },
  {
    feature: "Recurring Invoices",
    sleek: true,
    competitorNote: "QuickBooks: $20+ tier",
  },
];

export function ComparisonSection() {
  return (
    <section id="compare" className="py-16 md:py-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 uppercase tracking-tight">
            See how we compare
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            All the features at a fraction of the price
          </p>
        </div>

        <div className="lg:hidden space-y-3">
          {comparisonFeatures.map((item, index) => (
            <MobileComparisonItem
              key={index}
              feature={item.feature}
              sleek={item.sleek}
              competitorNote={item.competitorNote}
              highlight={item.highlight}
            />
          ))}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table
            className="w-full border-collapse"
            aria-label="Feature comparison between SleekInvoices and competitors"
          >
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Feature
                </th>
                <th scope="col" className="text-center py-3 px-4">
                  <div className="font-bold text-primary">SleekInvoices</div>
                  <div className="text-xs text-muted-foreground">$12/mo</div>
                </th>
                <th scope="col" className="text-center py-3 px-4">
                  <div className="font-medium text-foreground/80">
                    FreshBooks
                  </div>
                  <div className="text-xs text-muted-foreground">$21-65/mo</div>
                </th>
                <th scope="col" className="text-center py-3 px-4">
                  <div className="font-medium text-foreground/80">
                    QuickBooks
                  </div>
                  <div className="text-xs text-muted-foreground">$38-75/mo</div>
                </th>
                <th scope="col" className="text-center py-3 px-4">
                  <div className="font-medium text-foreground/80">Wave</div>
                  <div className="text-xs text-muted-foreground">$0/mo</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((item, index) => (
                <ComparisonRow
                  key={index}
                  feature={item.feature}
                  sleek={item.sleek}
                  freshbooks={
                    item.feature === "Crypto Payments" ||
                    item.feature === "QuickBooks Sync" ||
                    item.feature === "AI Invoice Creation"
                      ? false
                      : true
                  }
                  quickbooks={
                    item.feature === "Recurring Invoices"
                      ? "$20+ tier"
                      : item.feature === "Crypto Payments" ||
                          item.feature === "AI Invoice Creation"
                        ? false
                        : true
                  }
                  wave={
                    item.feature === "Crypto Payments" ||
                    item.feature === "QuickBooks Sync" ||
                    item.feature === "AI Invoice Creation"
                      ? false
                      : true
                  }
                  highlight={item.highlight}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <LandingButton
            href={getLoginUrl()}
            variant="primary"
            className="text-sm px-8 h-11 rounded-full"
          >
            Start Saving Today
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
