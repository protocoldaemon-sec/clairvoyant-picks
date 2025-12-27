import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/lib/config";

interface TopMarket {
  ticker: string;
  title: string;
  market_price: number;
  target_price: number;
  edge_pct: number;
  action: string;
  confidence: number;
  created_at?: string;
}

const FeaturedMarketCard = () => {
  const [market, setMarket] = useState<TopMarket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadTopMarket = async () => {
      try {
        const res = await fetch(`${API_URL}/recommendations?limit=1&sort_by=edge`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setMarket(data[0]);
            setLastUpdated(new Date());
          }
        }
      } catch (e) {
        console.error('Failed to load top market:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopMarket();
    const interval = setInterval(loadTopMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const marketOdds = market ? Math.round(market.market_price * 100) : 0;
  const aiPrediction = market ? Math.round(market.target_price * 100) : 0;
  const edge = market ? Math.round(Math.abs(market.edge_pct)) : 0;

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
          {isLoading ? (
            <div className="p-12 rounded-2xl border border-border bg-card flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : !market ? (
            <div className="p-12 rounded-2xl border border-border bg-card text-center">
              <p className="text-muted-foreground">No market signals available</p>
            </div>
          ) : (
            <div className="p-6 lg:p-8 rounded-2xl border border-border bg-card shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-accent text-foreground hover:bg-accent border-0 badge-shine">
                  <TrendingUp className="w-3 h-3 mr-1 animate-bounce-subtle" />
                  {market.action === 'BUY_YES' ? 'BUY' : 'SELL'}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {lastUpdated ? `Updated ${timeSince(lastUpdated)}` : 'Loading...'}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{market.ticker}</p>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {market.title || market.ticker}
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-secondary text-center hover:bg-secondary/80 transition-colors duration-200 group cursor-default">
                  <div className="text-xs text-muted-foreground mb-1">Market Odds</div>
                  <div className="text-2xl font-bold text-foreground transition-transform duration-200 group-hover:scale-110">{marketOdds}%</div>
                </div>
                <div className="p-4 rounded-xl bg-accent text-center hover:bg-accent/80 transition-colors duration-200 group cursor-default">
                  <div className="text-xs text-muted-foreground mb-1">AI Prediction</div>
                  <div className="text-2xl font-bold text-success transition-transform duration-200 group-hover:scale-110">{aiPrediction}%</div>
                </div>
                <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-center hover:bg-success/20 transition-all duration-200 group cursor-default hover:border-success/50">
                  <div className="text-xs text-muted-foreground mb-1">Edge</div>
                  <div className="text-2xl font-bold text-success transition-transform duration-200 group-hover:scale-110">+{edge}%</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary mb-6 transition-colors duration-200 hover:bg-secondary/80">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">What this means:</strong> AI confidence is{' '}
                  <span className="text-success font-semibold">{Math.round((market.confidence || 0) * 100)}%</span>.
                  The market is {market.action === 'BUY_YES' ? 'underpriced' : 'overpriced'} by{' '}
                  <span className="text-success font-semibold">{edge}%</span>.
                </p>
              </div>

              <Link to="/recommendations">
                <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 btn-press group transition-all duration-300 hover:shadow-lg hover:gap-3">
                  See All Opportunities
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMarketCard;
