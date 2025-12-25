import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";

const FeaturedMarketCard = () => {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Contoh Peluang Hari Ini
          </h2>
          <p className="text-muted-foreground">
            Lihat bagaimana kami menemukan edge yang menguntungkan
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-6 lg:p-8 rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-start justify-between mb-4">
              <Badge className="bg-accent text-foreground hover:bg-accent border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Edge Tinggi
              </Badge>
              <span className="text-xs text-muted-foreground">Update 2 menit lalu</span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-6">
              Akankah manusia mendarat di Mars sebelum kereta cepat California beroperasi?
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-secondary text-center">
                <div className="text-xs text-muted-foreground mb-1">Odds Pasar</div>
                <div className="text-2xl font-bold text-foreground">32%</div>
              </div>
              <div className="p-4 rounded-xl bg-accent text-center">
                <div className="text-xs text-muted-foreground mb-1">Prediksi AI</div>
                <div className="text-2xl font-bold text-success">78%</div>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-center">
                <div className="text-xs text-muted-foreground mb-1">Keuntungan</div>
                <div className="text-2xl font-bold text-success">+203%</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary mb-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Artinya:</strong> Jika Anda taruhan Rp100.000, 
                potensi keuntungan Anda sekitar Rp203.000 berdasarkan analisis AI kami.
              </p>
            </div>

            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12">
              Lihat Semua Peluang
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMarketCard;
