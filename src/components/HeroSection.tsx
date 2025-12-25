import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const HeroSection = () => {
  const trustItems = [
    "Analisis otomatis",
    "50+ pasar dipantau",
    "Update tiap 10 menit",
  ];

  const stats = [
    { value: "50+", label: "Pasar Aktif" },
    { value: "72%", label: "Rata-rata Win Rate" },
    { value: "203%", label: "Edge Tertinggi", highlight: true },
  ];

  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-foreground text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Analisis AI Real-time
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Temukan Peluang Terbaik di{" "}
            <span className="text-success">Kalshi</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
            Kami membantu Anda menemukan prediksi dengan peluang menang tertinggi. 
            Tanpa ribet, langsung lihat mana yang paling menguntungkan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12 px-8">
              Lihat Peluang Terbaik
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 border-primary/30 hover:bg-accent">
              Pelajari Cara Kerjanya
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl text-center ${
                stat.highlight
                  ? "bg-accent border-2 border-success/30"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                stat.highlight ? "text-success" : "text-foreground"
              }`}>
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
