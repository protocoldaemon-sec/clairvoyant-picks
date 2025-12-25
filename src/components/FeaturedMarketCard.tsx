import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";

const FeaturedMarketCard = () => {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Today's Top Opportunity
          </h2>
          <p className="text-muted-foreground">
            See how we find profitable edges in the market
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-6 lg:p-8 rounded-2xl border border-border bg-card shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <Badge className="bg-accent text-foreground hover:bg-accent border-0 badge-shine">
                <TrendingUp className="w-3 h-3 mr-1 animate-bounce-subtle" />
                High Edge
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Updated 2 min ago
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-6">
              Will a human land on Mars before California starts high-speed rail?
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-secondary text-center hover:bg-secondary/80 transition-colors duration-200 group cursor-default">
                <div className="text-xs text-muted-foreground mb-1">Market Odds</div>
                <div className="text-2xl font-bold text-foreground transition-transform duration-200 group-hover:scale-110">32%</div>
              </div>
              <div className="p-4 rounded-xl bg-accent text-center hover:bg-accent/80 transition-colors duration-200 group cursor-default">
                <div className="text-xs text-muted-foreground mb-1">AI Prediction</div>
                <div className="text-2xl font-bold text-success transition-transform duration-200 group-hover:scale-110">78%</div>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-center hover:bg-success/20 transition-all duration-200 group cursor-default hover:border-success/50">
                <div className="text-xs text-muted-foreground mb-1">Your Edge</div>
                <div className="text-2xl font-bold text-success transition-transform duration-200 group-hover:scale-110">+203%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary mb-6 transition-colors duration-200 hover:bg-secondary/80">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">What this means:</strong> If you bet $100, 
                your expected return is around $203 based on our AI analysis.
              </p>
            </div>

            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 btn-press group transition-all duration-300 hover:shadow-lg hover:gap-3">
              See All Opportunities
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMarketCard;
