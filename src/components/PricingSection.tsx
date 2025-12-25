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
          <div className="p-8 rounded-2xl border border-border bg-card text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">
              GRATIS
            </div>
            <div className="text-muted-foreground mb-6">
              Lihat semua analisis pasar
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Akses 50+ analisis pasar</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Update setiap 10 menit</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Tidak perlu kartu kredit</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border-2 border-accent/30 bg-accent/5 text-center">
            <div className="text-xs font-medium text-accent uppercase tracking-wide mb-4">
              Saat Anda Menang
            </div>
            <div className="text-4xl font-bold text-accent mb-2">
              3.5%
            </div>
            <div className="text-muted-foreground mb-6">
              dari kemenangan Anda saja
            </div>
            <div className="p-4 rounded-xl bg-background/50 text-sm text-muted-foreground">
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
