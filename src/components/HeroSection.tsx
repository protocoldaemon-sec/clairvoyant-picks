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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-foreground text-sm font-medium mb-6 animate-fade-up badge-shine">
            <span className="w-2 h-2 rounded-full bg-success relative">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            </span>
            Analisis AI Real-time
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight animate-fade-up stagger-1">
            Temukan Peluang Terbaik di{" "}
            <span className="text-success relative inline-block">
              Kalshi
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47.5 2.5 154 1 199 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: '0.6s' }}/>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up stagger-2">
            Kami membantu Anda menemukan prediksi dengan peluang menang tertinggi. 
            Tanpa ribet, langsung lihat mana yang paling menguntungkan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-up stagger-3">
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12 px-8 btn-press group transition-all duration-300 hover:shadow-lg hover:gap-3"
            >
              Lihat Peluang Terbaik
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-base h-12 px-8 border-primary/30 hover:bg-accent btn-press transition-all duration-200"
            >
              Pelajari Cara Kerjanya
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-up stagger-4">
            {trustItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 text-sm text-muted-foreground group cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 text-success transition-transform duration-200 group-hover:scale-110" />
                <span className="transition-colors duration-200 group-hover:text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-up stagger-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl text-center stat-highlight cursor-default ${
                stat.highlight
                  ? "bg-accent border-2 border-success/30 hover:border-success/50"
                  : "bg-card border border-border shadow-soft hover:shadow-card"
              } transition-all duration-300`}
            >
              <div className={`text-3xl lg:text-4xl font-bold mb-1 transition-colors duration-300 stat-value ${
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
