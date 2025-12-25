import logoBlack from "@/assets/logo-black.png";

const Footer = () => {
  const links = [
    { label: "Tentang", href: "#" },
    { label: "Cara Kerja", href: "#how-it-works" },
    { label: "Harga", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Privasi", href: "#" },
  ];

  return (
    <footer className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <a href="#" className="transition-transform duration-200 hover:scale-105 mb-4">
            <img src={logoBlack} alt="Clairvoyance" className="h-6" />
          </a>
          
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Clairvoyance by Daemon Protocol — Analisis AI untuk Prediction Markets
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
            {links.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="transition-colors duration-200 hover:text-foreground cursor-default">
              Kami tidak terafiliasi dengan Kalshi. Ini adalah tools analisis saja.
            </p>
            <p className="transition-colors duration-200 hover:text-foreground cursor-default">
              Biaya platform: 3.5% hanya dari kemenangan
            </p>
            <p className="transition-colors duration-200 hover:text-foreground cursor-default">
              © 2025 Clairvoyance. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
