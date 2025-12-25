import { Search, Brain, Filter, ExternalLink } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    { 
      icon: Search, 
      number: "1",
      title: "Kami Pantau Semua Pasar", 
      description: "Sistem kami memantau 50+ pasar di Kalshi secara otomatis setiap 10 menit" 
    },
    { 
      icon: Brain, 
      number: "2",
      title: "AI Analisis Peluang", 
      description: "AI menghitung peluang menang sebenarnya berdasarkan data dan berita terkini" 
    },
    { 
      icon: Filter, 
      number: "3",
      title: "Filter yang Terbaik", 
      description: "Hanya tampilkan 10% teratas dengan keuntungan potensial tertinggi" 
    },
    { 
      icon: ExternalLink, 
      number: "4",
      title: "Langsung Taruhan", 
      description: "Klik dan langsung diarahkan ke Kalshi untuk memasang taruhan Anda" 
    },
  ];

  return (
    <section id="how-it-works" className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Cara Kerjanya
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            4 langkah sederhana dari data mentah ke peluang menguntungkan
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative p-6 rounded-2xl border border-border bg-card card-interactive group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center transition-all duration-300 group-hover:bg-success/20 group-hover:scale-110">
                      <step.icon className="w-6 h-6 text-foreground transition-colors duration-300 group-hover:text-success" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-success mb-1 transition-transform duration-200 group-hover:translate-x-1">
                      Langkah {step.number}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-200 group-hover:text-foreground/80">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-secondary border border-border hover:shadow-card transition-all duration-300">
            <h3 className="font-semibold text-foreground mb-4 text-center">Contoh Perhitungan Edge</h3>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div className="p-3 rounded-xl bg-card hover:shadow-soft transition-all duration-200 group cursor-default">
                <div className="text-sm text-muted-foreground mb-1">Odds Pasar</div>
                <div className="text-xl font-bold text-foreground transition-transform duration-200 group-hover:scale-110">32%</div>
              </div>
              <div className="p-3 rounded-xl bg-accent hover:shadow-soft transition-all duration-200 group cursor-default">
                <div className="text-sm text-muted-foreground mb-1">AI Prediksi</div>
                <div className="text-xl font-bold text-success transition-transform duration-200 group-hover:scale-110">78%</div>
              </div>
              <div className="p-3 rounded-xl bg-success/10 border border-success/30 hover:border-success/50 transition-all duration-200 group cursor-default">
                <div className="text-sm text-muted-foreground mb-1">Edge Anda</div>
                <div className="text-xl font-bold text-success transition-transform duration-200 group-hover:scale-110">+46%</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Pasar menilai peluang 32%, tapi data menunjukkan 78%. Selisih 46% ini adalah keuntungan Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
