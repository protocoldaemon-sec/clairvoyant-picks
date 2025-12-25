const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pay Only When You Win
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="p-8 lg:p-10 rounded-xl border border-accent/50 bg-accent/5 text-center">
            <div className="text-6xl lg:text-7xl font-bold text-gradient-edge mb-2">
              3.5%
            </div>
            <div className="text-lg font-medium text-foreground mb-2">
              of your winnings only
            </div>
            <div className="text-sm text-muted-foreground">
              Lost your bet? Pay nothing
            </div>
          </div>

          <div className="p-8 lg:p-10 rounded-xl border border-border bg-card text-center">
            <div className="text-6xl lg:text-7xl font-bold text-foreground mb-2">
              FREE
            </div>
            <div className="text-lg font-medium text-foreground mb-2">
              to see all markets
            </div>
            <div className="text-sm text-muted-foreground">
              No subscription fees
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
