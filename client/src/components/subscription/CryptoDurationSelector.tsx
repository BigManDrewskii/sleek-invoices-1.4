import { cn } from "@/lib/utils";
import { Check, Sparkles, TrendingDown } from "lucide-react";
import {
  getAllCryptoTiers,
  CARD_PRICE_PER_MONTH,
  type CryptoSubscriptionTier,
} from "@shared/subscription";

interface CryptoDurationSelectorProps {
  selectedMonths: number;
  onSelect: (months: number) => void;
  className?: string;
}

export function CryptoDurationSelector({
  selectedMonths,
  onSelect,
  className,
}: CryptoDurationSelectorProps) {
  const tiers = getAllCryptoTiers();

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {tiers.map(tier => (
        <DurationCard
          key={tier.months}
          tier={tier}
          isSelected={selectedMonths === tier.months}
          onSelect={() => onSelect(tier.months)}
        />
      ))}
    </div>
  );
}

interface DurationCardProps {
  tier: CryptoSubscriptionTier;
  isSelected: boolean;
  onSelect: () => void;
}

function DurationCard({ tier, isSelected, onSelect }: DurationCardProps) {
  const cardTotal = CARD_PRICE_PER_MONTH * tier.months;
  const savings = cardTotal - tier.totalPrice;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex flex-col p-4 rounded-xl border-2 transition-all text-left",
        "hover:border-primary/50 hover:bg-primary/5",
        isSelected
          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
          : "border-border bg-card"
      )}
    >
      {/* Recommended badge */}
      {tier.recommended && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wide">
            <Sparkles className="h-3 w-3" />
            Popular
          </span>
        </div>
      )}

      {/* Selection indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        )}
      >
        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>

      {/* Duration label */}
      <span className="text-sm font-medium text-muted-foreground">
        {tier.label}
      </span>

      {/* Price */}
      <div className="mt-2">
        <span className="text-2xl font-bold">
          ${tier.totalPrice.toFixed(2)}
        </span>
        {tier.months > 1 && (
          <span className="text-xs text-muted-foreground ml-1">
            (${tier.pricePerMonth.toFixed(2)}/mo)
          </span>
        )}
      </div>

      {/* Savings badge */}
      <div className="mt-2 flex items-center gap-1.5">
        <TrendingDown className="h-3.5 w-3.5 text-green-500" />
        <span className="text-xs font-medium text-green-500">
          Save {tier.savingsPercent}%
        </span>
        <span className="text-xs text-muted-foreground">
          (${savings.toFixed(2)} off)
        </span>
      </div>

      {/* Compared to card price */}
      <div className="mt-1">
        <span className="text-[10px] text-muted-foreground line-through">
          ${cardTotal.toFixed(2)} with card
        </span>
      </div>
    </button>
  );
}

/**
 * Compact version for inline use
 */
interface CompactDurationSelectorProps {
  selectedMonths: number;
  onSelect: (months: number) => void;
  className?: string;
}

export function CompactDurationSelector({
  selectedMonths,
  onSelect,
  className,
}: CompactDurationSelectorProps) {
  const tiers = getAllCryptoTiers();

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {tiers.map(tier => (
        <button
          key={tier.months}
          type="button"
          onClick={() => onSelect(tier.months)}
          className={cn(
            "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
            selectedMonths === tier.months
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          {tier.label}
          {tier.recommended && (
            <Sparkles className="h-3 w-3 ml-1 inline-block" />
          )}
        </button>
      ))}
    </div>
  );
}
