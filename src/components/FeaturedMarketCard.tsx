import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Shield, DollarSign } from "lucide-react";

const FeaturedMarketCard = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 lg:p-12 rounded-2xl border border-accent/30 bg-gradient-card shadow-glow">
            <Badge className="absolute -top-3 left-8 bg-accent text-accent-foreground hover:bg-accent border-0">
              HIGHEST EDGE
            </Badge>

            <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-8 pr-8">
              Will a human land on Mars before California starts high-speed rail?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Current Odds</div>
                <div className="text-3xl font-bold text-foreground">32%</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="text-sm text-muted-foreground mb-1">AI Win Rate</div>
                <div className="text-3xl font-bold text-accent">78%</div>
              </div>
              <div className="p-4 rounded-lg bg-accent/20 border border-accent/50">
                <div className="text-sm text-muted-foreground mb-1">Edge</div>
                <div className="text-3xl font-bold text-gradient-edge">+203%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Platform: Kalshi</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Confidence: 78%</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>+$203 per $100</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Updated: 2 min ago</span>
              </div>
            </div>

            <Button className="w-full sm:w-auto gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              See All High-Edge Markets
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMarketCard;
