import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Brain, Calculator, Filter, ListOrdered, ExternalLink, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { icon: Download, title: "Fetch All Markets", description: "Pull live data from Kalshi API (50+ markets)" },
    { icon: Brain, title: "AI Win Rate Analysis", description: "Calculate true probability using news, volatility, and historical data" },
    { icon: Calculator, title: "Calculate Edge", description: "Compare AI win rate vs market odds to find mispricing" },
    { icon: Filter, title: "Filter Top 10%", description: "Show only markets with highest expected returns" },
    { icon: ListOrdered, title: "Rank by Confidence", description: "Sort by AI confidence score and liquidity" },
    { icon: ExternalLink, title: "Direct Link to Kalshi", description: "One click to place your bet on Kalshi" },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How We Find the Best Bets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI analyzes every Kalshi market and filters down to the top 10% with highest expected returns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="text-sm text-accent font-medium mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Runs every 10 minutes automatically
            </div>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/50 hover:border-accent/30 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">0{index + 1}</span>
                      <span className="font-semibold text-foreground">{step.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Real Example</h3>
              
              <div className="p-6 rounded-xl border border-border bg-card mb-6">
                <p className="text-foreground font-medium mb-6">
                  "Will a human land on Mars before California starts high-speed rail?"
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Kalshi Odds</div>
                    <div className="text-2xl font-bold text-foreground">32%</div>
                    <div className="text-xs text-muted-foreground">What market thinks</div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">AI Win Rate</div>
                    <div className="text-2xl font-bold text-accent">78%</div>
                    <div className="text-xs text-muted-foreground">What data shows</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/20 border border-accent/50 mb-6">
                  <Badge className="mb-2 bg-accent text-accent-foreground hover:bg-accent border-0 text-xs">
                    YOUR EDGE
                  </Badge>
                  <div className="text-3xl font-bold text-gradient-edge mb-2">+203%</div>
                  <p className="text-sm text-foreground mb-1">
                    Market underpricing by <strong>46 percentage points</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If you bet $100 at 32% odds but true probability is 78%, expected return is $203
                  </p>
                </div>

                <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Bet on Kalshi
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
