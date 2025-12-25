import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logoBlack from "@/assets/logo-black.png";
import logoWhite from "@/assets/logo-white.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const navLinks = [
    { label: "Markets", href: "#markets" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
            <img 
              src={resolvedTheme === "dark" ? logoWhite : logoBlack} 
              alt="Clairvoyance" 
              className="h-6 sm:h-7" 
            />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/30 hover:bg-accent hover:border-accent transition-all duration-200 btn-press"
            >
              Log In
            </Button>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 btn-press hover:shadow-lg"
            >
              Sign Up Free
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground transition-transform duration-200 hover:scale-110 active:scale-95"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4 pt-2 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2 hover:translate-x-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 border-primary/30 hover:bg-accent btn-press">
                  Log In
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 btn-press">
                  Sign Up Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
