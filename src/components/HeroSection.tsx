import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/lib/config";

interface Stats {
  totalMarkets: number;
  totalCrypto: number;
  buySignals: number;
  sellSignals: number;
  topEdge: number;
}

const HeroSection = () => {
  const [stats, setStats] = useState<Stats>({
    totalMarkets: 0,
    totalCrypto: 0,
    buySignals: 0,
    sellSignals: 0,
    topEdge: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [marketsRes, cryptoRes] = await Promise.all([
          fetch(`${API_URL}/recommendations?limit=100`),
          fetch(`${API_URL}/crypto/recommendations?limit=20`),
        ]);

        if (marketsRes.ok) {
          const markets = await marketsRes.json();
          const topEdge = Math.max(...markets.map((m: any) => Math.abs(m.edge_pct || 0)), 0);
          setStats((prev) => ({
            ...prev,
            totalMarkets: markets.length,
            topEdge: Math.round(topEdge),
          }));
        }

        if (cryptoRes.ok) {
          const crypto = await cryptoRes.json();
          setStats((prev) => ({
            ...prev,
            totalCrypto: crypto.length,
            buySignals: crypto.filter((c: any) => c.signal?.action === 'BUY').length,
            sellSignals: crypto.filter((c: any) => c.signal?.action === 'SELL').length,
          }));
        }
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const trustItems = ['Live analysis', `${stats.totalMarkets + stats.totalCrypto}+ signals tracked`, 'Updates every 5 min'];

  const statsDisplay = [
    { value: `${stats.totalMarkets}`, label: 'Market Signals' },
    { value: `${stats.totalCrypto}`, label: 'Crypto Signals' },
    { value: `${stats.topEdge}%`, label: 'Top Edge', highlight: true },
  ];

  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-foreground text-sm font-medium mb-6 animate-fade-up badge-shine">
            <span className="w-2 h-2 rounded-full bg-success relative">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            </span>
            AI Real-time Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight animate-fade-up stagger-1">
            AI-Powered Trading on{' '}
            <span className="text-success relative inline-block">
              Kalshi
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path
                  d="M1 5.5C47.5 2.5 154 1 199 5.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-fade-in"
                  style={{ animationDelay: '0.6s' }}
                />
              </svg>
            </span>{' '}
            &{' '}
            <span className="text-warning relative inline-block">
              Binance
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path
                  d="M1 5.5C47.5 2.5 154 1 199 5.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-fade-in"
                  style={{ animationDelay: '0.8s' }}
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
            Multi-agent pipeline for crypto & prediction markets. Real-time technical analysis, Monte Carlo algorithm,
            and Kelly criterion position sizing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-up stagger-3">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12 px-8 btn-press group transition-all duration-300 hover:shadow-lg hover:gap-3"
              >
                Start Trading
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/crypto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-8 border-primary/30 hover:bg-accent btn-press transition-all duration-200"
              >
                View Signals
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-up stagger-4">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground group cursor-default">
                <CheckCircle2 className="w-4 h-4 text-success transition-transform duration-200 group-hover:scale-110" />
                <span className="transition-colors duration-200 group-hover:text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-up stagger-5">
          {statsDisplay.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl text-center stat-highlight cursor-default ${
                stat.highlight
                  ? 'bg-accent border-2 border-success/30 hover:border-success/50'
                  : 'bg-card border border-border shadow-soft hover:shadow-card'
              } transition-all duration-300`}
            >
              <div
                className={`text-3xl lg:text-4xl font-bold mb-1 transition-colors duration-300 stat-value ${
                  stat.highlight ? 'text-success' : 'text-foreground'
                }`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
