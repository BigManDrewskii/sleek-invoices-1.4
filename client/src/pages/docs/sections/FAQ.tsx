import { SectionHeading, SubsectionHeading, P, Strong } from "../docComponents";

const faqData = {
  "General Questions": [
    {
      q: "Is SleekInvoices secure?",
      a: "Yes. We use industry-standard encryption, secure authentication, and PCI-compliant payment processing. Your data is encrypted in transit and at rest. We never store credit card information.",
    },
    {
      q: "Can I export my data?",
      a: "Yes. Go to Settings → Download My Data to export all your invoices, clients, expenses, and other data in JSON or CSV format.",
    },
    {
      q: "What happens to my data if I cancel?",
      a: "Your data is preserved indefinitely. You can reactivate your account anytime and access all historical data. Only if you explicitly request account deletion is your data removed.",
    },
    {
      q: "Is there a contract or lock-in period?",
      a: "No. SleekInvoices is month-to-month with no long-term contracts. Cancel anytime with no penalties.",
    },
  ],
  "Invoicing Questions": [
    {
      q: "Can I create invoices in different currencies?",
      a: "Yes. When creating an invoice, select the currency (USD, EUR, GBP, BTC, ETH, etc.). The invoice displays in that currency.",
    },
    {
      q: "Can I send invoices to multiple clients at once?",
      a: "Not in a single action, but you can create recurring invoices for regular clients or use batch invoicing for multiple invoices in one workflow.",
    },
    {
      q: "Can I edit an invoice after sending?",
      a: "No, but you can create a revised version or credit memo. Go to the invoice → three-dot menu → Create Revised Invoice or Create Credit Memo.",
    },
    {
      q: "What if a client pays partially?",
      a: "Record the partial payment, and the invoice status changes to 'Partially Paid'. The outstanding balance is still tracked. Send reminders for the remaining amount.",
    },
  ],
  "Payment Questions": [
    {
      q: "Which payment methods do you support?",
      a: "Stripe (credit/debit cards), cryptocurrency (300+ coins), and manual bank transfers. Clients can choose their preferred method.",
    },
    {
      q: "How long does it take to receive payments?",
      a: "Stripe payments settle within 1-2 business days. Cryptocurrency payments confirm within minutes. Manual transfers depend on the client's bank.",
    },
    {
      q: "Do you charge fees for payments?",
      a: "Stripe charges 2.9% + $0.30 per transaction. Cryptocurrency charges 0.5-1% (NOWPayments fee). These are deducted from the payment amount. Manual transfers have no fee.",
    },
    {
      q: "Can I accept payments without using Stripe?",
      a: "Yes. You can provide bank transfer details or accept cryptocurrency. Clients can also pay via the client portal using any method you enable.",
    },
  ],
  "Subscription Questions": [
    {
      q: "Can I change my plan anytime?",
      a: "Yes. Upgrade to Pro anytime, and downgrade at the end of your billing period. Changes take effect immediately.",
    },
    {
      q: "What happens if I exceed the Free plan limit?",
      a: "You can't create more than 3 invoices in a month on the Free plan. Upgrade to Pro to remove the limit.",
    },
    {
      q: "Can I pay for Pro with cryptocurrency?",
      a: "Yes. On the Subscription page, select 'Pay with Crypto' and choose your preferred cryptocurrency and subscription duration.",
    },
    {
      q: "Is there a discount for annual billing?",
      a: "Yes. If paying with cryptocurrency, annual billing (12 months) costs $102 instead of $144 (15% discount).",
    },
  ],
  "AI Features Questions": [
    {
      q: "How does Magic Invoice work?",
      a: "Describe your invoice in plain English (e.g., '10 hours of web design at $75/hour'), and our AI parses the description, creates line items, and calculates totals automatically.",
    },
    {
      q: "How many AI credits do I get?",
      a: "Free plan: 5 credits/month. Pro plan: 50 credits/month. Each invoice generation uses 1 credit. Purchase additional credits anytime.",
    },
    {
      q: "Can I use Magic Invoice without AI credits?",
      a: "No, Magic Invoice requires AI credits. Use the Smart Invoice Builder or Classic Form as alternatives (no credits required).",
    },
    {
      q: "How accurate is the AI?",
      a: "The AI is highly accurate for standard invoices. For complex scenarios, review the generated invoice before sending. You can always edit line items manually.",
    },
  ],
  "Client Portal Questions": [
    {
      q: "Is the client portal secure?",
      a: "Yes. Portal access requires a unique, time-limited link. Clients see only their own invoices. Links expire after 30 days.",
    },
    {
      q: "Can clients create accounts?",
      a: "No. Clients access the portal via a unique link without creating an account. This simplifies the experience.",
    },
    {
      q: "Can I customize the client portal branding?",
      a: "Yes. Your company logo, colors, and custom footer appear in the client portal, matching your invoice templates.",
    },
  ],
  "Integration Questions": [
    {
      q: "Does SleekInvoices integrate with QuickBooks?",
      a: "Yes. Connect your QuickBooks Online account to automatically sync invoices, clients, and payments.",
    },
    {
      q: "Does SleekInvoices integrate with accounting software?",
      a: "Currently, QuickBooks is our primary integration. We're working on Xero and other platforms. You can export data to CSV for manual import into other software.",
    },
    {
      q: "Can I integrate with my website or app?",
      a: "Not directly, but you can export data via CSV or use the client portal link on your website.",
    },
  ],
  "Data & Privacy Questions": [
    {
      q: "Where is my data stored?",
      a: "Your data is stored on secure, encrypted servers in the United States. We use industry-standard security practices and regular backups.",
    },
    {
      q: "Can I delete my account?",
      a: "Yes. Go to Settings → Delete My Account and follow the confirmation steps. All your data will be permanently deleted.",
    },
    {
      q: "Do you sell my data?",
      a: "No. We never sell or share your data with third parties. See our Privacy Policy for details.",
    },
    {
      q: "Is my data GDPR compliant?",
      a: "Yes. We comply with GDPR, CCPA, and other data protection regulations. You can request a data export or deletion anytime.",
    },
  ],
  "Troubleshooting Questions": [
    {
      q: "Why is my invoice number not sequential?",
      a: "Invoice numbers are sequential per user, but if you delete a draft invoice, the number is skipped. This is intentional to prevent number reuse.",
    },
    {
      q: "Why did my email bounce?",
      a: "Common reasons: incorrect email address, client's email server blocking our domain, or client's mailbox full. Verify the email address and resend.",
    },
    {
      q: "Why is my payment not showing up?",
      a: "Stripe payments take 1-2 business days to settle. Cryptocurrency payments confirm within minutes. Check your Stripe dashboard or blockchain explorer.",
    },
    {
      q: "How do I contact support?",
      a: "Click the help icon in the app or email support@sleekinvoices.com. We respond within 24 hours.",
    },
  ],
};

function FAQCategory({
  category,
  items,
}: {
  category: string;
  items: { q: string; a: string }[];
}) {
  return (
    <div className="space-y-4">
      <SubsectionHeading>{category}</SubsectionHeading>
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <P>
            <Strong>Q: {item.q}</Strong>
          </P>
          <div className="text-muted-foreground">
            <P>{item.a}</P>
          </div>
        </div>
      ))}
    </div>
  );
}

export const FAQ = () => (
  <div className="space-y-8">
    <SectionHeading>FAQ</SectionHeading>
    {Object.entries(faqData).map(([category, items]) => (
      <FAQCategory key={category} category={category} items={items} />
    ))}
  </div>
);
