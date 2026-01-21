import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Terms() {
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
                href="/privacy"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                Privacy
              </Link>
              <Link
                href="/refund-policy"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-all"
              >
                Refunds
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 12, 2026
            </p>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using SleekInvoices ("Service"), you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, you may not access or use the Service. These
                Terms apply to all visitors, users, and others who access or use
                the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We may update these Terms from time to time. Your continued use
                of the Service after any changes constitutes acceptance of the
                updated Terms. We encourage you to review these Terms
                periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to use the Service. By using
                the Service, you represent and warrant that you are at least 18
                years of age and have the legal capacity to enter into these
                Terms. If you are using the Service on behalf of a business or
                organization, you represent that you have the authority to bind
                that entity to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SleekInvoices is an online invoicing platform that allows users
                to create, manage, and send professional invoices. The Service
                includes features such as invoice generation, client management,
                payment tracking, analytics, AI-powered features (Sleeky AI),
                and integrations with third-party services including QuickBooks
                Online.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The Service is provided on an "as is" and "as available" basis.
                We reserve the right to modify, suspend, or discontinue any part
                of the Service at any time with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. User Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use certain features of the Service, you must create an
                account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>
                  Notifying us immediately of any unauthorized use of your
                  account
                </li>
                <li>
                  Ensuring that your account information is accurate and
                  up-to-date
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that
                violate these Terms or that we reasonably believe are being used
                for fraudulent or illegal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Subscription and Billing
              </h2>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.1 Subscription Plans
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                SleekInvoices offers both free and paid subscription plans. The
                features available to you depend on your subscription level.
                Details of current plans and pricing are available on our
                website.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.2 Billing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Paid subscriptions are billed in advance on a monthly or annual
                basis, depending on the plan you select. By subscribing to a
                paid plan, you authorize us to charge your payment method for
                the subscription fees. All fees are quoted in US dollars unless
                otherwise specified.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.3 Automatic Renewal
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Subscriptions automatically renew at the end of each billing
                period unless you cancel before the renewal date. You can cancel
                your subscription at any time from your account settings.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.4 Price Changes
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to change our pricing with at least 30
                days' notice. Price changes will take effect at the start of
                your next billing period after the notice period.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.5 Refunds
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Refunds are handled according to our{" "}
                <Link
                  href="/refund-policy"
                  className="text-primary hover:underline"
                >
                  Refund Policy
                </Link>
                . We offer a 30-day money-back guarantee for new subscribers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. AI Features (Sleeky AI)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service includes AI-powered features ("Sleeky AI") that use
                machine learning to assist with invoicing tasks. By using these
                features, you agree to the following:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">AI Credits:</strong> AI
                  features consume credits based on your subscription plan. Free
                  users receive limited credits; Pro users receive additional
                  credits monthly.
                </li>
                <li>
                  <strong className="text-foreground">
                    Content Responsibility:
                  </strong>{" "}
                  You are responsible for reviewing and approving all
                  AI-generated content before use. AI outputs may contain errors
                  or inaccuracies.
                </li>
                <li>
                  <strong className="text-foreground">No Guarantees:</strong> AI
                  features are provided as-is without guarantees of accuracy,
                  completeness, or fitness for any particular purpose.
                </li>
                <li>
                  <strong className="text-foreground">Prohibited Uses:</strong>{" "}
                  You may not use AI features to generate illegal, harmful,
                  fraudulent, or misleading content.
                </li>
                <li>
                  <strong className="text-foreground">
                    Third-Party Providers:
                  </strong>{" "}
                  AI features are powered by third-party AI providers. Your use
                  is subject to their terms and usage policies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Acceptable Use
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>
                  Infringe upon the intellectual property rights of others
                </li>
                <li>
                  Transmit any harmful, threatening, abusive, or offensive
                  content
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service or its
                  systems
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use the Service for fraudulent purposes or to create
                  fraudulent invoices
                </li>
                <li>Impersonate any person or entity</li>
                <li>Collect or harvest user data without authorization</li>
                <li>
                  Use automated systems (bots, scrapers) to access the Service
                  without permission
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Third-Party Integrations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service may integrate with third-party services, including
                but not limited to QuickBooks Online, Stripe, and NOWPayments.
                When you connect your account to a third-party service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  You authorize us to access and sync data between the Service
                  and the third-party service
                </li>
                <li>
                  You are also bound by the third-party's terms of service and
                  privacy policy
                </li>
                <li>
                  We are not responsible for the availability, accuracy, or
                  functionality of third-party services
                </li>
                <li>
                  You may disconnect third-party integrations at any time
                  through your account settings
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Intellectual Property
              </h2>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                9.1 Our Intellectual Property
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and
                functionality are owned by SleekInvoices and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws. You may not copy, modify,
                distribute, sell, or lease any part of the Service without our
                prior written consent.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                9.2 Your Content
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you create using the
                Service, including invoices, client data, and business
                information. By using the Service, you grant us a limited
                license to use, store, and process your content solely to
                provide the Service to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Data and Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Service is also governed by our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and protect your personal
                information. By using the Service, you consent to our data
                practices as described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Disclaimer of Warranties
              </h2>
              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <p className="text-muted-foreground leading-relaxed uppercase text-sm">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                  WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
                  BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO
                  NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
                  ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED. YOU USE THE
                  SERVICE AT YOUR OWN RISK.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Limitation of Liability
              </h2>
              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <p className="text-muted-foreground leading-relaxed uppercase text-sm">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SLEEKINVOICES AND ITS
                  OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUES, DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES, WHETHER INCURRED
                  DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE OF THE SERVICE.
                  IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU
                  PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless SleekInvoices
                and its officers, directors, employees, agents, and affiliates
                from and against any claims, damages, losses, liabilities,
                costs, and expenses (including reasonable attorneys' fees)
                arising from or related to: (a) your use of the Service; (b)
                your violation of these Terms; (c) your violation of any rights
                of another party; or (d) your content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                14. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including breach of these Terms. Upon termination:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Your right to use the Service will immediately cease</li>
                <li>You remain liable for any outstanding fees</li>
                <li>
                  We may delete your data after 90 days (see our Privacy Policy
                  for details)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You may also terminate your account at any time by contacting us
                or through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                15. Dispute Resolution
              </h2>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                15.1 Informal Resolution
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Before filing a formal dispute, you agree to contact us at{" "}
                <a
                  href="mailto:legal@sleekinvoices.com"
                  className="text-primary hover:underline"
                >
                  legal@sleekinvoices.com
                </a>{" "}
                to attempt to resolve the dispute informally. We will work in
                good faith to resolve any issues within 30 days.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                15.2 Binding Arbitration
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                If we cannot resolve a dispute informally, you agree that any
                dispute, claim, or controversy arising from or relating to these
                Terms or the Service shall be resolved by binding arbitration,
                rather than in court. The arbitration shall be conducted in
                accordance with the rules of the American Arbitration
                Association (AAA).
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                15.3 Class Action Waiver
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree that any arbitration or legal proceeding shall be
                conducted on an individual basis and not as a class action,
                collective action, or representative action. You waive any right
                to participate in a class action lawsuit or class-wide
                arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                16. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, United States, without
                regard to its conflict of law provisions. Any legal action or
                proceeding not subject to arbitration shall be brought
                exclusively in the federal or state courts located in Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                17. Force Majeure
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We shall not be liable for any failure or delay in performing
                our obligations under these Terms due to circumstances beyond
                our reasonable control, including but not limited to acts of
                God, natural disasters, war, terrorism, riots, embargoes, acts
                of civil or military authorities, fire, floods, accidents,
                strikes, or shortages of transportation, facilities, fuel,
                energy, labor, or materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                18. Severability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid, illegal,
                or unenforceable, the remaining provisions shall continue in
                full force and effect. The invalid provision shall be modified
                to the minimum extent necessary to make it valid and enforceable
                while preserving its original intent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                19. Entire Agreement
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy and Refund Policy,
                constitute the entire agreement between you and SleekInvoices
                regarding the Service and supersede all prior agreements,
                understandings, and communications, whether written or oral.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                20. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="p-6 bg-card/50 border border-border rounded-xl">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Legal Inquiries:</strong>{" "}
                  <a
                    href="mailto:legal@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    legal@sleekinvoices.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">General Support:</strong>{" "}
                  <a
                    href="mailto:support@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    support@sleekinvoices.com
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
                      className="hover:text-foreground transition-colors text-primary"
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
                      className="hover:text-foreground transition-colors"
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
