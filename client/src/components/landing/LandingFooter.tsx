import { Link } from "wouter";

export function LandingFooter() {
  return (
    <footer className="relative mt-8">
      <div className="container max-w-4xl mx-auto px-6">
        <img
          src="/sleeky-relaxed.png"
          alt="Sleeky relaxing"
          className="w-40 md:w-56 h-auto mb-[-1.5rem] sleeky-float"
        />
      </div>

      <div className="border-t border-border bg-card/30">
        <div className="container max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/monogram-white.svg"
                  alt=""
                  role="presentation"
                  className="h-7 w-7"
                />
                <span className="font-semibold text-foreground">
                  SleekInvoices
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional invoicing for freelancers and small businesses.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#compare"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Compare
                  </a>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:support@sleekinvoices.com"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors rounded-sm"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-4">Compare</h4>
              <ul className="space-y-2 text-sm text-muted-foreground/60">
                <li>
                  <span>vs FreshBooks</span>
                </li>
                <li>
                  <span>vs QuickBooks</span>
                </li>
                <li>
                  <span>vs AND.CO</span>
                </li>
                <li>
                  <span>vs Wave</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground/60">
              © {new Date().getFullYear()} SleekInvoices. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground/60">
              <span>
                Made with <span aria-label="love">❤️</span> for freelancers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
