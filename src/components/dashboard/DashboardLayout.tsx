import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Trophy, 
  BarChart3,
  Menu,
  ChevronLeft,
  ChevronDown,
  Home,
  Bitcoin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletButton from '@/components/WalletButton';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from 'next-themes';
import ThemeToggle from '@/components/ThemeToggle';
import logoWhite from '@/assets/logo-white.png';
import logoBlack from '@/assets/logo-black.png';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { path: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/recommendations', label: 'Markets', icon: BarChart3 },
  { path: '/crypto', label: 'Crypto', icon: TrendingUp },
  { 
    path: '/portfolio', 
    label: 'Portfolio', 
    icon: Wallet,
    children: [
      { path: '/portfolio', label: 'Market Portfolio', icon: Wallet },
      { path: '/crypto/portfolio', label: 'Crypto Portfolio', icon: Bitcoin },
    ]
  },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);

  const isPortfolioActive = location.pathname === '/portfolio' || location.pathname === '/crypto/portfolio';
  const logo = resolvedTheme === 'dark' ? logoWhite : logoBlack;

  const simulationBalance = user?.balance?.simulation ?? 10000;
  const realBalance = user?.balance?.real ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-background sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/">
            <img src={logo} alt="Clairvoyance" className="h-8" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {/* Balance Display */}
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
              {/* Simulation Balance */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Sim:</span>
                  <span className="text-blue-400 font-medium ml-1">${simulationBalance.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-px h-4 bg-border"></div>
              {/* Real Balance */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Real:</span>
                  <span className="text-green-400 font-medium ml-1">${realBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden by default */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo & Close */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link to="/" onClick={() => setSidebarOpen(false)}>
                <img src={logo} alt="Clairvoyance" className="h-6" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                // Item with dropdown
                if (item.children) {
                  return (
                    <div key={item.path}>
                      <button
                        onClick={() => setPortfolioOpen(!portfolioOpen)}
                        className={cn(
                          'flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors',
                          isPortfolioActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </div>
                        <ChevronDown className={cn(
                          'h-4 w-4 transition-transform',
                          portfolioOpen && 'rotate-180'
                        )} />
                      </button>
                      
                      {/* Dropdown items */}
                      <div className={cn(
                        'overflow-hidden transition-all duration-200',
                        portfolioOpen ? 'max-h-40 mt-1' : 'max-h-0'
                      )}>
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                'flex items-center gap-3 px-4 py-2 pl-12 rounded-lg transition-colors text-sm',
                                isChildActive
                                  ? 'bg-muted text-foreground'
                                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                              )}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                
                // Regular item
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-65px)] overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
