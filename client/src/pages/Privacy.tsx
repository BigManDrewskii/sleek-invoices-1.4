import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Privacy() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 12, 2026
            </p>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SleekInvoices ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                invoicing platform and services ("Service"). Please read this
                policy carefully to understand our practices regarding your
                personal data.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                By using SleekInvoices, you consent to the data practices
                described in this policy. If you do not agree with our
                practices, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                2.1 Information You Provide
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect information you voluntarily provide when using our
                Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    Account Information:
                  </strong>{" "}
                  Name, email address, and authentication credentials when you
                  create an account
                </li>
                <li>
                  <strong className="text-foreground">
                    Business Information:
                  </strong>{" "}
                  Company name, address, logo, and tax identification numbers
                </li>
                <li>
                  <strong className="text-foreground">Client Data:</strong>{" "}
                  Names, email addresses, and contact information of your
                  clients
                </li>
                <li>
                  <strong className="text-foreground">Invoice Data:</strong>{" "}
                  Invoice details, line items, amounts, and payment information
                </li>
                <li>
                  <strong className="text-foreground">
                    Payment Information:
                  </strong>{" "}
                  Billing details processed through our payment providers
                </li>
                <li>
                  <strong className="text-foreground">AI Interactions:</strong>{" "}
                  Prompts and content you provide when using our AI-powered
                  features (Sleeky AI)
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                2.2 Information Collected Automatically
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you access our Service, we automatically collect certain
                information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Usage Data:</strong> Pages
                  visited, features used, actions taken, and time spent within
                  the Service
                </li>
                <li>
                  <strong className="text-foreground">
                    Device Information:
                  </strong>{" "}
                  Browser type, operating system, device type, and screen
                  resolution
                </li>
                <li>
                  <strong className="text-foreground">Log Data:</strong> IP
                  addresses, access times, referring URLs, and error logs
                </li>
                <li>
                  <strong className="text-foreground">Analytics Data:</strong>{" "}
                  Aggregated usage patterns and performance metrics
                </li>
                <li>
                  <strong className="text-foreground">Cookies:</strong> Session
                  cookies and authentication tokens to maintain your login state
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                2.3 Information from Third-Party Integrations
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                When you connect third-party services like QuickBooks Online, we
                may receive:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  OAuth tokens to maintain the connection (we do not store your
                  QuickBooks password)
                </li>
                <li>Company information from your QuickBooks account</li>
                <li>Customer and invoice data necessary for synchronization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For users in the European Economic Area (EEA), we process your
                personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    Contract Performance:
                  </strong>{" "}
                  Processing necessary to provide the Service you requested
                  (e.g., creating invoices, managing clients)
                </li>
                <li>
                  <strong className="text-foreground">
                    Legitimate Interests:
                  </strong>{" "}
                  Processing for our legitimate business interests, such as
                  improving the Service, preventing fraud, and ensuring security
                </li>
                <li>
                  <strong className="text-foreground">Consent:</strong>{" "}
                  Processing based on your explicit consent, such as for
                  marketing communications or optional AI features
                </li>
                <li>
                  <strong className="text-foreground">Legal Obligation:</strong>{" "}
                  Processing required to comply with applicable laws and
                  regulations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process invoices and manage your client relationships</li>
                <li>
                  Power AI features including Sleeky Smart Compose and Sleeky AI
                  Assistant
                </li>
                <li>
                  Synchronize data with connected third-party services (e.g.,
                  QuickBooks)
                </li>
                <li>
                  Send transactional emails (invoice notifications, payment
                  confirmations)
                </li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud or security issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. AI Features and Automated Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SleekInvoices includes AI-powered features ("Sleeky AI") that
                use machine learning to assist you:
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.1 AI Features We Offer
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    Sleeky Smart Compose:
                  </strong>{" "}
                  Generates invoice content from natural language descriptions
                </li>
                <li>
                  <strong className="text-foreground">
                    Sleeky AI Assistant:
                  </strong>{" "}
                  Provides conversational help with invoicing tasks
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.2 How AI Data is Processed
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                When you use AI features:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Your prompts and inputs are sent to third-party AI providers
                  for processing
                </li>
                <li>
                  AI responses are generated based on your input and general
                  training data
                </li>
                <li>
                  We do not use your specific business data to train AI models
                </li>
                <li>
                  AI interactions may be logged for quality improvement and
                  abuse prevention
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                5.3 Automated Decision Making
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI features assist with content generation but do not make
                legally significant automated decisions about you. You always
                have final control over invoice content and business decisions.
                If you have concerns about automated processing, you may contact
                us to request human review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Data Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information with:
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                6.1 Service Providers (Subprocessors)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                We work with trusted third-party companies to operate the
                Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Manus:</strong> Platform
                  infrastructure, hosting, database, file storage, and
                  authentication services
                </li>
                <li>
                  <strong className="text-foreground">Stripe:</strong> Payment
                  processing and subscription management
                </li>
                <li>
                  <strong className="text-foreground">NOWPayments:</strong>{" "}
                  Cryptocurrency payment processing
                </li>
                <li>
                  <strong className="text-foreground">Resend:</strong>{" "}
                  Transactional email delivery
                </li>
                <li>
                  <strong className="text-foreground">OpenRouter:</strong> AI
                  model routing for Sleeky AI features
                </li>
                <li>
                  <strong className="text-foreground">
                    Intuit QuickBooks:
                  </strong>{" "}
                  Accounting integration (when connected by you)
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                6.2 Platform Provider
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                SleekInvoices is built and hosted on the Manus platform. Manus
                provides our infrastructure including servers, databases, file
                storage, and authentication services. Your data is stored on
                Manus infrastructure and is subject to both this Privacy Policy
                and{" "}
                <a
                  href="https://manus.im/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Manus's Privacy Policy
                </a>
                . Manus processes your data solely to provide infrastructure
                services to SleekInvoices and does not use your data for its own
                purposes.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                6.3 Third-Party Integrations
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you authorize integrations (such as QuickBooks Online), we
                share necessary data to enable synchronization. You control
                these connections and can disconnect them at any time from your
                Settings page. Each integration is subject to the third party's
                own privacy policy.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                6.4 Legal Requirements
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose information if required by law, court order, or
                government request, or to protect our rights, property, or
                safety, or the rights, property, or safety of others.
              </p>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                6.5 Business Transfers
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                If SleekInvoices is involved in a merger, acquisition, or sale
                of assets, your personal data may be transferred as part of that
                transaction. We will notify you of any such change and any
                choices you may have.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. QuickBooks Integration
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you connect SleekInvoices to QuickBooks Online:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  We use OAuth 2.0 for secure authentication — we never see or
                  store your QuickBooks password
                </li>
                <li>
                  We access only the data necessary for invoice and customer
                  synchronization
                </li>
                <li>
                  Data flows one-way from SleekInvoices to QuickBooks (we push
                  invoices and customers)
                </li>
                <li>
                  You can disconnect the integration at any time, which revokes
                  our access
                </li>
                <li>
                  Your QuickBooks data is also subject to{" "}
                  <a
                    href="https://www.intuit.com/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Intuit's Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>All data is transmitted over HTTPS/TLS encryption</li>
                <li>Data is encrypted at rest in our databases</li>
                <li>
                  OAuth tokens and sensitive credentials are stored securely
                </li>
                <li>Access to production systems is restricted and logged</li>
                <li>Regular security assessments and updates</li>
                <li>Multi-factor authentication available for user accounts</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100%
                secure. While we strive to protect your data, we cannot
                guarantee absolute security. In the event of a data breach, we
                will notify affected users and relevant authorities as required
                by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your data according to the following guidelines:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Active Account:</strong>{" "}
                  Data is retained for as long as your account is active
                </li>
                <li>
                  <strong className="text-foreground">Account Deletion:</strong>{" "}
                  Personal data is deleted or anonymized within 30 days of
                  account deletion
                </li>
                <li>
                  <strong className="text-foreground">
                    Subscription Cancellation:
                  </strong>{" "}
                  Data is retained for 90 days after cancellation to allow
                  reactivation
                </li>
                <li>
                  <strong className="text-foreground">
                    Legal Requirements:
                  </strong>{" "}
                  Some data may be retained longer if required by law (e.g.,
                  financial records)
                </li>
                <li>
                  <strong className="text-foreground">Backups:</strong> Data may
                  persist in encrypted backups for up to 90 days after deletion
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Your Rights
              </h2>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                10.1 Rights Under GDPR (EEA Users)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                If you are in the European Economic Area, you have the following
                rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Access:</strong> Request a
                  copy of your personal data
                </li>
                <li>
                  <strong className="text-foreground">Rectification:</strong>{" "}
                  Correct inaccurate or incomplete data
                </li>
                <li>
                  <strong className="text-foreground">Erasure:</strong> Request
                  deletion of your personal data ("right to be forgotten")
                </li>
                <li>
                  <strong className="text-foreground">Portability:</strong>{" "}
                  Receive your data in a portable, machine-readable format
                </li>
                <li>
                  <strong className="text-foreground">Objection:</strong> Object
                  to certain processing of your data
                </li>
                <li>
                  <strong className="text-foreground">Restriction:</strong>{" "}
                  Request limited processing of your data
                </li>
                <li>
                  <strong className="text-foreground">Withdraw Consent:</strong>{" "}
                  Withdraw consent at any time where processing is based on
                  consent
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                10.2 Rights Under CCPA (California Residents)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                If you are a California resident, you have additional rights
                under the California Consumer Privacy Act:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Right to Know:</strong>{" "}
                  Request disclosure of the categories and specific pieces of
                  personal information collected
                </li>
                <li>
                  <strong className="text-foreground">Right to Delete:</strong>{" "}
                  Request deletion of your personal information
                </li>
                <li>
                  <strong className="text-foreground">Right to Correct:</strong>{" "}
                  Request correction of inaccurate personal information
                </li>
                <li>
                  <strong className="text-foreground">Right to Opt-Out:</strong>{" "}
                  Opt-out of the sale or sharing of personal information
                </li>
                <li>
                  <strong className="text-foreground">
                    Right to Non-Discrimination:
                  </strong>{" "}
                  Not be discriminated against for exercising your privacy
                  rights
                </li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                10.3 Do Not Sell My Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  We do not sell your personal information.
                </strong>{" "}
                SleekInvoices does not sell, rent, or trade your personal data
                to third parties for monetary consideration. We share data only
                with service providers who help us operate the Service, as
                described in this policy.
              </p>

              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@sleekinvoices.com"
                  className="text-primary hover:underline"
                >
                  privacy@sleekinvoices.com
                </a>
                . We will respond to your request within 30 days (or as required
                by applicable law).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the following types of cookies and similar technologies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">
                    Essential Cookies:
                  </strong>{" "}
                  Required for the Service to function (authentication, session
                  management)
                </li>
                <li>
                  <strong className="text-foreground">
                    Analytics Cookies:
                  </strong>{" "}
                  Help us understand how users interact with the Service
                  (aggregated, anonymized)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not use advertising or tracking cookies. You can configure
                your browser to refuse cookies, but this may affect your ability
                to use certain features of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries other
                than your own, including the United States. We ensure
                appropriate safeguards are in place to protect your data in
                accordance with this Privacy Policy and applicable laws,
                including Standard Contractual Clauses where required for
                transfers from the EEA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is not intended for users under 18 years of age. We
                do not knowingly collect personal information from children. If
                we become aware that we have collected data from a child under
                18, we will take steps to delete it promptly. If you believe we
                have collected information from a child, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                14. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date. For significant
                changes that affect your rights, we will also notify you via
                email. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                15. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-6 bg-card/50 border border-border rounded-xl">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">
                    Privacy Inquiries:
                  </strong>{" "}
                  <a
                    href="mailto:privacy@sleekinvoices.com"
                    className="text-primary hover:underline"
                  >
                    privacy@sleekinvoices.com
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
              <p className="text-muted-foreground leading-relaxed mt-4">
                For users in the EEA, you also have the right to lodge a
                complaint with your local data protection authority if you
                believe we have not adequately addressed your concerns.
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
                      className="hover:text-foreground transition-colors text-primary"
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
