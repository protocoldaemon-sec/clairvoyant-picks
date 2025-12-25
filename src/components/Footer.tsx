import logoBlack from "@/assets/logo-black.png";

const Footer = () => {
  return (
    <footer className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <img src={logoBlack} alt="Clairvoyance" className="h-6 mb-4" />
          
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Clairvoyance by Daemon Protocol — Analisis AI untuk Prediction Markets
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cara Kerja
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Harga
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privasi
            </a>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Kami tidak terafiliasi dengan Kalshi. Ini adalah tools analisis saja.</p>
            <p>Biaya platform: 3.5% hanya dari kemenangan</p>
            <p>© 2025 Clairvoyance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
