import { Check, Gift } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">
            Bayar Hanya Saat Anda Menang
          </h2>
          <p className="text-muted-foreground">
            Tidak ada biaya berlangganan. Gratis melihat semua analisis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl border border-border bg-card text-center hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
              <Gift className="w-6 h-6 text-foreground transition-transform duration-200 group-hover:rotate-12" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2 transition-transform duration-200 group-hover:scale-105">
              GRATIS
            </div>
            <div className="text-muted-foreground mb-6">
              Lihat semua analisis pasar
            </div>
            <div className="space-y-3 text-left">
              {[
                "Akses 50+ analisis pasar",
                "Update setiap 10 menit",
                "Tidak perlu kartu kredit"
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 text-sm group/item cursor-default"
                >
                  <Check className="w-4 h-4 text-success transition-transform duration-200 group-hover/item:scale-110" />
                  <span className="text-muted-foreground transition-colors duration-200 group-hover/item:text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl border-2 border-success/30 bg-accent text-center hover:border-success/50 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group">
            <div className="text-xs font-medium text-success uppercase tracking-wide mb-4 transition-transform duration-200 group-hover:scale-105">
              Saat Anda Menang
            </div>
            <div className="text-4xl font-bold text-success mb-2 transition-transform duration-300 group-hover:scale-110">
              3.5%
            </div>
            <div className="text-muted-foreground mb-6">
              dari kemenangan Anda saja
            </div>
            <div className="p-4 rounded-xl bg-card text-sm text-muted-foreground transition-all duration-200 hover:shadow-soft">
              <strong className="text-foreground">Kalah?</strong> Tidak bayar apa-apa. 
              Kami hanya sukses jika Anda sukses.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
