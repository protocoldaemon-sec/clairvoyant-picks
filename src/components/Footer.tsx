import logoWhite from "@/assets/logo-white.png";

const Footer = () => {
  const links = [
    { label: "About", href: "#" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="py-12 lg:py-16 bg-gradient-hero border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logoWhite} alt="Clairvoyance" className="h-8 mb-4 invert dark:invert-0" />
          <p className="text-sm text-muted-foreground max-w-md">
            Clairvoyance by Daemon Protocol — Predict Clearly on Kalshi
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            We are not affiliated with Kalshi. Analytics tool only—all betting happens on Kalshi.
          </p>
          <p className="text-xs text-muted-foreground">
            Platform fee: 3.5% on winnings only
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 Clairvoyance - AI Intelligence for Prediction Markets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
