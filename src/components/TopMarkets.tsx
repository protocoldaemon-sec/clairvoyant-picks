import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink, TrendingUp } from "lucide-react";

const TopMarkets = () => {
  const markets = [
    {
      question: "Akankah manusia mendarat di Mars sebelum kereta cepat California beroperasi?",
      marketOdds: 32,
      aiWinRate: 78,
      edge: 203,
    },
    {
      question: "Akankah inflasi turun di bawah 2.5% pada Q2 2025?",
      marketOdds: 45,
      aiWinRate: 68,
      edge: 51,
    },
    {
      question: "Akankah Bitcoin mencapai $150k sebelum 2026?",
      marketOdds: 28,
      aiWinRate: 52,
      edge: 86,
    },
  ];

  return (
    <section id="markets" className="py-12 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-sm text-success font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Update 2 menit lalu
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Peluang Terbaik Saat Ini
          </h2>
          <p className="text-muted-foreground">
            Top 10% pasar dengan edge tertinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {markets.map((market, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-accent text-foreground hover:bg-accent border-0 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Edge Tinggi
                </Badge>
              </div>

              <h3 className="text-sm font-medium text-foreground mb-4 line-clamp-2 min-h-[40px]">
                {market.question}
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="p-2 rounded-lg bg-secondary">
                  <div className="text-xs text-muted-foreground">Pasar</div>
                  <div className="font-semibold text-foreground">{market.marketOdds}%</div>
                </div>
                <div className="p-2 rounded-lg bg-accent">
                  <div className="text-xs text-muted-foreground">AI</div>
                  <div className="font-semibold text-success">{market.aiWinRate}%</div>
                </div>
                <div className="p-2 rounded-lg bg-success/10 border border-success/30">
                  <div className="text-xs text-muted-foreground">Edge</div>
                  <div className="font-semibold text-success">+{market.edge}%</div>
                </div>
              </div>

              <Button size="sm" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Taruhan Sekarang
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="gap-2 border-primary/30 hover:bg-accent">
            Lihat Semua 50+ Pasar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopMarkets;
