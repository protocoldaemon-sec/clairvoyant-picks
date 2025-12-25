import { X, Check, ArrowRight } from "lucide-react";

const ValueProposition = () => {
  const withoutItems = [
    "Scroll 50+ pasar satu-satu",
    "Tebak-tebakan mana yang bagus",
    "Lewatkan peluang terbaik",
    "Buang waktu berjam-jam",
  ];

  const withItems = [
    "Langsung lihat yang terbaik saja",
    "AI hitung peluang menang untuk Anda",
    "Update otomatis tiap 10 menit",
    "Satu klik ke Kalshi",
  ];

  return (
    <section className="py-12 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Mengapa Pakai Clairvoyance?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hemat waktu dan tingkatkan peluang menang dengan analisis AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <X className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Tanpa Clairvoyance</h3>
            </div>
            <div className="space-y-4">
              {withoutItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 group/item cursor-default"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <X className="w-5 h-5 text-destructive/60 mt-0.5 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                  <span className="text-muted-foreground transition-colors duration-200 group-hover/item:text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border-2 border-success/30 bg-accent hover:border-success/50 hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Check className="w-4 h-4 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Dengan Clairvoyance</h3>
            </div>
            <div className="space-y-4">
              {withItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 group/item cursor-default"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110" />
                  <span className="text-foreground transition-transform duration-200 group-hover/item:translate-x-1">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent border border-success/30 text-foreground font-medium hover:border-success/50 hover:shadow-lg transition-all duration-300 cursor-default group">
            <ArrowRight className="w-4 h-4 text-success transition-transform duration-300 group-hover:translate-x-1" />
            Temukan peluang terbaik dalam 5 menit
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
