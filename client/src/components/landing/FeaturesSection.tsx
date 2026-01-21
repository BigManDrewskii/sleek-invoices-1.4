const features = [
  {
    title: "Describe your work",
    description:
      "Tell Sleeky what you did in plain English. No forms, no templates.",
  },
  {
    title: "AI creates your invoice",
    description:
      "Sleeky extracts client, items, rates, and generates a professional invoice instantly.",
  },
  {
    title: "One-click send",
    description:
      "Review and send directly to your client's inbox. PDF attached automatically.",
  },
  {
    title: "Get paid, stay notified",
    description:
      "Automatic payment reminders. Real-time notifications when you get paid.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3 uppercase tracking-tight">
            From idea to invoice{" "}
            <span className="text-primary">in seconds</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            No forms. No templates. Just tell Sleeky what you did and watch the
            magic happen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-5 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-1 text-sm sm:text-base">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
