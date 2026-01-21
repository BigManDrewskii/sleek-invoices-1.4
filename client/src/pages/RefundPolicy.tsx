import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Matching Landing Page Style */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/10 rounded-full">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/landing"
              className="flex items-center group"
              aria-label="SleekInvoices - Go to home"
            >
              {/* Wide logo for desktop (lg+) */}
              <img
                src="/logos/wide/SleekInvoices-Logo-Wide.svg"
                alt=""
                role="presentation"
                className="hidden lg:block h-7 w-auto transition-transform duration-150 ease-out group-hover:scale-[1.03]"
                style={{ filter: "brightness(1.1)" }}
              />
              {/* Monogram for mobile and tablet (below lg) */}
              <img
                src="/logos/monogram/SleekInvoices-Monogram-White.svg"
                alt=""
                role="presentation"
                className="lg:hidden h-8 w-8 transition-transform duration-150 ease-out group-hover:scale-110"
              />
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/landing"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                Home
              </Link>
              <Link
                href="/terms"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-full hidden md:inline-flex"
              >
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <a href={getLoginUrl()}>
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-28 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Refund Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 12, 2026
            </p>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At SleekInvoices, we want you to be completely satisfied with
                your purchase. This Refund Policy outlines the circumstances
                under which refunds may be issued for subscription fees and
                one-time purchases. Please read this policy carefully before
                making a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. 30-Day Money-Back Guarantee
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer a{" "}
                <strong className="text-foreground">
                  30-day money-back guarantee
                </strong>{" "}
                for new subscribers. If you're not satisfied with SleekInvoices
                within the first 30 days of your initial subscription, you can
                request a full refund—no questions asked.
              </p>
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  How to Request a Refund (First 30 Days)
                </h3>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                  <li>
                    Email us at{" "}
                    <a
                      href="mailto:support@sleekinvoices.com"
                      className="text-primary hover:underline"
                    >
                      support@sleekinvoices.com
                    </a>
                  </li>
                  <li>Include your account email address</li>
                  <li>
                    Optionally, let us know why you're canceling (helps us
                    improve)
                  </li>
                  <li>
                    Refunds are processed within 5-7 business days to your
                    original payment method
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Pro-Rated Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                After the initial 30-day period, refund eligibility depends on
                your subscription type:
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                3.1 Annual Subscriptions
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Annual subscribers may be eligible for a pro-rated refund based
                on unused months:
              </p>
              <div className="p-4 bg-muted/30 border border-border rounded-lg mb-4">
                <p className="text-muted-foreground font-mono text-sm">
                  <strong className="text-foreground">Refund Amount</strong> =
                  (Months Remaining ÷ 12) × Annual Fee Paid
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                For example, if you paid $60/year and cancel after 6 months, you
                may receive a refund of approximately $30 (6 remaining months ÷
                12 × $60).
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                3.2 Monthly Subscriptions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Monthly subscriptions are{" "}
                <strong className="text-foreground">
                  not eligible for pro-rated refunds
                </strong>
                . When you cancel a monthly subscription, you retain access
                until the end of your current billing period, but no refund is
                issued for the current month.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. One-Time Purchases (AI Credits)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AI credit purchases and other one-time transactions are
                generally{" "}
                <strong className="text-foreground">non-refundable</strong> once
                processed. However, refunds may be considered in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    Duplicate Charges:
                  </strong>{" "}
                  If you were charged multiple times due to a technical error
                </li>
                <li>
                  <strong className="text-foreground">
                    Unauthorized Charges:
                  </strong>{" "}
                  If a charge was made without your authorization (subject to
                  verification)
                </li>
                <li>
                  <strong className="text-foreground">
                    Service Unavailability:
                  </strong>{" "}
                  If the Service was unavailable and prevented you from using
                  purchased credits
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Refund requests for one-time purchases must be submitted within{" "}
                <strong className="text-foreground">14 days</strong> of the
                transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Cryptocurrency Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Subscriptions paid via cryptocurrency follow the same refund
                policy as credit card payments, with the following
                considerations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Refunds are issued in the original cryptocurrency when
                  possible
                </li>
                <li>
                  Exchange rate fluctuations between payment and refund are not
                  compensated
                </li>
                <li>Blockchain network transaction fees are non-refundable</li>
                <li>
                  Processing may take 7-14 business days due to blockchain
                  confirmation times
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Subscription Cancellation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can cancel your subscription at any time from your account
                Settings page. When you cancel:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  You retain full access to the Service until the end of your
                  current billing period
                </li>
                <li>No further charges will be made after cancellation</li>
                <li>
                  Your data is retained for 90 days in case you wish to
                  reactivate
                </li>
                <li>
                  After 90 days, your data may be permanently deleted (see our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  )
                </li>
              </ul>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-4">
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  <strong>Tip:</strong> Export your data before cancellation if
                  you need a permanent copy. You can export invoices, clients,
                  and other data from the Settings page.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Exceptions and Limitations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Refunds will <strong className="text-foreground">not</strong> be
                provided in the following cases:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Account suspension or termination due to violation of our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>Failure to cancel before the subscription renewal date</li>
                <li>
                  Change of mind after the 30-day guarantee period (for monthly
                  subscriptions)
                </li>
                <li>Refund requests made more than 90 days after the charge</li>
                <li>
                  Services already consumed or delivered (e.g., used AI credits)
                </li>
                <li>
                  Chargebacks filed without first contacting us for resolution
                </li>
              </ul>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-6">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Maximum Refund Cap
                </h3>
                <p className="text-muted-foreground text-sm">
                  In accordance with our Terms of Service, refunds are limited
                  to a maximum of three (3) months' fees or charges, regardless
                  of subscription length or total payment amount.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Service Disruptions
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If SleekInvoices experiences significant service disruptions
                caused by us (not third-party services or circumstances beyond
                our control), affected users may be eligible for account credits
                or partial refunds. We will communicate any such issues and
                remedies via email to affected users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. How to Request a Refund
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-3 ml-4">
                <li>
                  <strong className="text-foreground">Contact Support:</strong>{" "}
                  Email us at{" "}
                  <a
                    href="mailto:support@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    support@sleekinvoices.com
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Provide Details:</strong>{" "}
                  Include your account email, transaction ID (if available), and
                  reason for the refund request
                </li>
                <li>
                  <strong className="text-foreground">Response Time:</strong> We
                  will review your request and respond within 2-3 business days
                </li>
                <li>
                  <strong className="text-foreground">Processing:</strong>{" "}
                  Approved refunds are processed within 5-7 business days to
                  your original payment method
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Refund Policy from time to time. Any changes
                will be posted on this page with an updated "Last updated" date.
                For significant changes that may affect your rights, we will
                notify active subscribers via email at least 30 days before the
                changes take effect. Continued use of SleekInvoices after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about our Refund Policy or need assistance
                with a refund request, please contact us:
              </p>
              <div className="p-6 bg-card/50 border border-border rounded-xl">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Refund Requests:</strong>{" "}
                  <a
                    href="mailto:support@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    support@sleekinvoices.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">
                    General Inquiries:
                  </strong>{" "}
                  <a
                    href="mailto:hello@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    hello@sleekinvoices.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Website:</strong>{" "}
                  <a
                    href="https://sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    https://sleekinvoices.com
                  </a>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                We're committed to fair and transparent billing practices. If
                you're experiencing issues with SleekInvoices, please reach out
                to our support team before requesting a refund—we're here to
                help resolve any problems.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer - Matching Landing Page Style */}
      <footer className="relative mt-16">
        <div className="border border-border rounded-t-2xl bg-card/30">
          <div className="container max-w-5xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 mb-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <img
                    src="/monogram-white.svg"
                    alt="SleekInvoices"
                    className="h-7 w-7"
                  />
                  <span className="font-semibold text-foreground">
                    SleekInvoices
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Professional invoicing for freelancers and small businesses.
                  80% cheaper than the competition.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm">
                  Product
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/landing"
                      className="hover:text-foreground transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/landing"
                      className="hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/landing"
                      className="hover:text-foreground transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm">
                  Legal
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund-policy"
                      className="hover:text-foreground transition-colors text-primary"
                    >
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm">
                  Get Started
                </h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li>
                    <a
                      href={getLoginUrl()}
                      className="hover:text-foreground transition-colors"
                    >
                      Sign In
                    </a>
                  </li>
                  <li>
                    <a
                      href={getLoginUrl()}
                      className="hover:text-foreground transition-colors"
                    >
                      Create Account
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 SleekInvoices. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/refund-policy"
                  className="hover:text-foreground transition-colors"
                >
                  Refunds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
