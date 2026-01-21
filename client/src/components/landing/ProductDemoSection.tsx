import { DashboardMockup } from "./DashboardMockup";

export function ProductDemoSection() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Everything you need
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto font-medium">
            Create, send, and track invoices in seconds
          </p>
        </div>

        <DashboardMockup />
      </div>
    </section>
  );
}
