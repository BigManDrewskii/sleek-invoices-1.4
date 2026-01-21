import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { LandingButton } from "./LandingButton";

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6 overflow-visible px-4">
          <img
            src="/sleeky.svg"
            alt="Sleeky character - the friendly mascot of SleekInvoices"
            className="h-56 sm:h-64 md:h-80 w-auto mx-auto max-w-full"
            style={{
              objectFit: "contain",
            }}
          />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight tracking-tight mb-5 uppercase max-w-5xl mx-auto">
          Invoice on
          <br />
          <span className="text-primary">Autopilot</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 font-medium">
          Professional invoicing that works so you don't have to
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <LandingButton
            href={getLoginUrl()}
            variant="primary"
            className="text-sm sm:text-base px-8 h-12 sm:h-14 rounded-full font-semibold"
          >
            Get Started Now
          </LandingButton>
          <LandingButton
            href="/docs"
            variant="outline"
            className="text-sm sm:text-base px-8 h-12 sm:h-14 rounded-full font-semibold border-2"
          >
            See How It Works
          </LandingButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">✓</span> No credit card
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">✓</span> 3 free invoices
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">✓</span> Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
