import { Badge } from "@/components/ui/badge";
import { X, Check, Sparkles, Clock, Target, Database } from "lucide-react";

const ValueProposition = () => {
  const withoutItems = [
    "Browse 50+ markets manually",
    "Guess which polls have edge",
    "Miss high-value opportunities",
    "Waste hours analyzing data",
  ];

  const withItems = [
    "See only top 10% highest edge",
    "AI-calculated win rates",
    "Updated every 10 minutes",
    "One click to Kalshi",
  ];

  const resultItems = [
    { icon: Clock, text: "5 minutes", subtext: "to find best bets" },
    { icon: Target, text: "Higher win rates", subtext: "with AI edge" },
    { icon: Sparkles, text: "Never miss", subtext: "high-value markets" },
    { icon: Database, text: "Data-backed", subtext: "decisions" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stop Scrolling Through 50+ Markets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We filter and show you only the highest win rate opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-6 lg:p-8 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-6 text-muted-foreground">Without Clairvoyance</h3>
            <div className="space-y-4">
              {withoutItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8 rounded-xl border border-accent/50 bg-accent/5 relative">
            <Badge className="absolute -top-3 left-6 bg-accent text-accent-foreground hover:bg-accent border-0">
              WITH CLAIRVOYANCE
            </Badge>
            <h3 className="text-lg font-semibold mb-6 text-foreground">With Clairvoyance</h3>
            <div className="space-y-4">
              {withItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8 rounded-xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Your Result</h3>
            <div className="space-y-4">
              {resultItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-foreground font-medium">{item.text}</span>
                    <span className="text-muted-foreground ml-1">{item.subtext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
