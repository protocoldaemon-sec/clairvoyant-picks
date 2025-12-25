import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Clock, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const trustItems = [
    { icon: Zap, label: "Live analysis" },
    { icon: BarChart3, label: "50+ markets tracked" },
    { icon: Clock, label: "10 min updates" },
    { icon: TrendingUp, label: "Top 10% only" },
  ];

  const stats = [
    { value: "50", label: "Markets" },
    { value: "5", label: "High Edge" },
    { value: "203%", label: "Top Edge", highlight: true },
    { value: "72%", label: "Avg Win Rate" },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-hero pt-20 lg:pt-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
            Predict{" "}
            <span className="text-gradient-edge">Clearly</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Find the best bets on Kalshi with AI-powered win rate analysis
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            We analyze 50+ prediction markets every 10 minutes and show you only the highest win rate opportunities. No guesswork—just data-driven picks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
              See Top Picks Now
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              How We Find Wins
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-accent" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${
                  stat.highlight
                    ? "border-accent/50 bg-accent/5"
                    : "border-border bg-card/50"
                } backdrop-blur-sm`}
              >
                <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                  stat.highlight ? "text-gradient-edge" : "text-foreground"
                }`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
