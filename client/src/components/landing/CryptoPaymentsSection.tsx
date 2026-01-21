import { Bitcoin } from "lucide-react";

export function CryptoPaymentsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/10" />
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />

          <div className="relative p-6 md:p-10">
            <div className="grid gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-4">
                  <Bitcoin className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-medium text-orange-400">
                    Crypto-Native
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3 uppercase tracking-tight">
                  Get paid in crypto
                </h2>

                <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                  Accept Bitcoin, Ethereum, and 300+ cryptocurrencies. Instant
                  settlement, zero chargebacks, global reach.
                </p>
                <p className="text-xs text-muted-foreground/80 mb-6">
                  Powered by{" "}
                  <span className="text-foreground font-medium">
                    NOWPayments
                  </span>{" "}
                  — trusted crypto payment infrastructure
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-400">
                    BTC
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                    ETH
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
                    USDT
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-muted/50 border border-border text-xs font-medium text-muted-foreground">
                    +300 more
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-background/40 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Chargebacks
                    </span>
                    <span className="text-lg font-bold text-green-500">0%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/40 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Settlement
                    </span>
                    <span className="text-lg font-bold text-primary">
                      Instant
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/40 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Fee</span>
                    <span className="text-lg font-bold text-foreground">
                      1%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
