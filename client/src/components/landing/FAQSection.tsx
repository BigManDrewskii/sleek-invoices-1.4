interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="p-5 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors">
      <h3 className="font-medium text-foreground text-sm mb-2">{question}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  );
}

const faqData = [
  {
    question: "Is SleekInvoices really free to start?",
    answer:
      "Yes! Create up to 3 invoices per month completely free, forever. No credit card required. Upgrade to Pro for $12/month when needed.",
  },
  {
    question: "How does the AI invoice creation work?",
    answer:
      "Just describe your work in plain English (e.g., 'Website design for Acme Corp, 20 hours at $100/hr'). Sleeky generates a professional invoice instantly.",
  },
  {
    question: "What payment methods can my clients use?",
    answer:
      "Clients can pay via Stripe (cards, Apple Pay, Google Pay) or cryptocurrency through NOWPayments (Bitcoin, Ethereum, USDT, 300+ coins).",
  },
  {
    question: "Can I customize my invoice design?",
    answer:
      "Absolutely. Add your logo, choose colors, and select from professional templates. Your invoices will match your brand perfectly.",
  },
  {
    question: "How do automatic payment reminders work?",
    answer:
      "Set your reminder schedule and SleekInvoices automatically sends polite follow-ups to clients with overdue invoices.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption, secure authentication, and never share your data. Your financial information stays private.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 uppercase tracking-tight">
            Common Questions
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Everything you need to know about SleekInvoices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
