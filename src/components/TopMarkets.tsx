import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";

const TopMarkets = () => {
  const markets = [
    {
      question: "Will a human land on Mars before California starts high-speed rail?",
      marketOdds: 32,
      aiWinRate: 78,
      edge: 203,
      confidence: "High",
    },
    {
      question: "Will inflation fall below 2.5% by Q2 2025?",
      marketOdds: 45,
      aiWinRate: 68,
      edge: 51,
      confidence: "High",
    },
    {
      question: "Will Bitcoin hit $150k before 2026?",
      marketOdds: 28,
      aiWinRate: 52,
      edge: 86,
      confidence: "Medium",
    },
    {
      question: "Will the Fed cut rates 3+ times in 2025?",
      marketOdds: 55,
      aiWinRate: 72,
      edge: 31,
      confidence: "High",
    },
  ];

  return (
    <section id="markets" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Top Markets Right Now
            </h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Updated 2 minutes ago — Showing top 10% by edge
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            View All 50 Markets
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {markets.map((market, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border bg-card hover:border-accent/30 hover:shadow-hover transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10">
                  HIGH EDGE
                </Badge>
                <span className="text-xs text-muted-foreground">Kalshi</span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-6 line-clamp-2">
                {market.question}
              </h3>

              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Market:</span>
                  <span className="font-medium text-foreground">{market.marketOdds}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">AI:</span>
                  <span className="font-medium text-accent">{market.aiWinRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className={`font-medium ${market.confidence === "High" ? "text-accent" : "text-warning"}`}>
                    {market.confidence}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Edge</div>
                  <div className="text-2xl font-bold text-gradient-edge">+{market.edge}%</div>
                </div>
                <Button size="sm" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                  Bet Now
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopMarkets;
