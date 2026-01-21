import { LandingButton } from "./LandingButton";
import { getLoginUrl } from "@/const";

export function CTASection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            Ready to get paid?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Join thousands of freelancers and small businesses using
            SleekInvoices.
          </p>
          <LandingButton
            href={getLoginUrl()}
            variant="primary"
            className="text-sm px-8 h-11 rounded-full"
          >
            Start Free
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
