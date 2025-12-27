import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/lib/config";

interface Market {
  ticker: string;
  title: string;
  market_price: number;
  target_price: number;
  edge_pct: number;
  action: string;
  confidence: number;
}

const TopMarkets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const res = await fetch(`${API_URL}/recommendations?limit=6&sort_by=edge`);
        if (res.ok) {
          const data = await res.json();
          setMarkets(data.slice(0, 3));
          setLastUpdated(new Date());
        }
      } catch (e) {
        console.error('Failed to load markets:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
    const interval = setInterval(loadMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <section id="markets" className="py-12 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm text-success font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-success relative">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            </span>
            {lastUpdated ? `Updated ${timeSince(lastUpdated)}` : 'Loading...'}
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Top Markets Right Now
          </h2>
          <p className="text-muted-foreground">
            Highest edge opportunities from Kalshi
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : markets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No market signals available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {markets.map((market, index) => (
              <div
                key={market.ticker || index}
                className="p-5 rounded-2xl border border-border bg-card card-interactive group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-accent text-foreground hover:bg-accent border-0 text-xs badge-shine">
                    <TrendingUp className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                    {market.action === 'BUY_YES' ? 'BUY' : 'SELL'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{market.ticker}</span>
                </div>

                <h3 className="text-sm font-medium text-foreground mb-4 line-clamp-2 min-h-[40px] transition-colors duration-200 group-hover:text-foreground">
                  {market.title || market.ticker}
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-lg bg-secondary transition-all duration-200 group-hover:bg-secondary/80">
                    <div className="text-xs text-muted-foreground">Market</div>
                    <div className="font-semibold text-foreground">{(market.market_price * 100).toFixed(0)}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-accent transition-all duration-200 group-hover:bg-accent/80">
                    <div className="text-xs text-muted-foreground">AI Target</div>
                    <div className="font-semibold text-success">{(market.target_price * 100).toFixed(0)}%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-success/10 border border-success/30 transition-all duration-200 group-hover:border-success/50 group-hover:bg-success/20">
                    <div className="text-xs text-muted-foreground">Edge</div>
                    <div className="font-semibold text-success">+{Math.abs(market.edge_pct).toFixed(0)}%</div>
                  </div>
                </div>

                <Link to="/recommendations">
                  <Button 
                    size="sm" 
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 btn-press group/btn transition-all duration-300 hover:gap-3"
                  >
                    View Analysis
                    <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover/btn:rotate-12" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/recommendations">
            <Button 
              variant="outline" 
              className="gap-2 border-primary/30 hover:bg-accent btn-press group transition-all duration-300 hover:gap-3"
            >
              View All Markets
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopMarkets;
