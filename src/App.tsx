import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import SolanaWalletProvider from "./components/SolanaWalletProvider";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Crypto from "./pages/Crypto";
import CryptoPortfolio from "./pages/CryptoPortfolio";
import Portfolio from "./pages/Portfolio";
import Leaderboard from "./pages/Leaderboard";
import Pipeline from "./pages/Pipeline";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SolanaWalletProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crypto" element={<Crypto />} />
                <Route path="/crypto/portfolio" element={<CryptoPortfolio />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/recommendations" element={<Recommendations />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
