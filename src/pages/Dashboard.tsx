import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import CryptoCard from '@/components/dashboard/CryptoCard';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import CryptoAnalysisModal from '@/components/dashboard/CryptoAnalysisModal';
import TradeModal from '@/components/dashboard/TradeModal';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { dashboardApi, recommendationsApi } from '@/lib/api';

interface DashboardData {
  total_markets: number;
  high_edge_count: number;
}

interface CryptoSummary {
  total_pnl: number;
  open_positions: number;
  win_rate: number;
  winning_trades: number;
  losing_trades: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [cryptoRecommendations, setCryptoRecommendations] = useState<any[]>([]);
  const [marketRecommendations, setMarketRecommendations] = useState<any[]>([]);
  const [cryptoSummary, setCryptoSummary] = useState<CryptoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedMarketRec, setSelectedMarketRec] = useState<any>(null);
  const [selectedCryptoRec, setSelectedCryptoRec] = useState<any>(null);
  const [tradeRec, setTradeRec] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashboard, cryptoRec, marketRec, summary] = await Promise.all([
        dashboardApi.get().catch(() => null),
        fetch(`${API_URL}/crypto/recommendations?limit=6`).then(r => r.ok ? r.json() : []).catch(() => []),
        recommendationsApi.getTop(4).catch(() => []),
        fetch(`${API_URL}/crypto/positions/summary`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      
      setDashboardData(dashboard as DashboardData);
      setCryptoRecommendations(cryptoRec);
      setMarketRecommendations(marketRec as any[]);
      setCryptoSummary(summary);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const buySignals = cryptoRecommendations.filter(r => r.signal?.action === 'BUY').length;
  const sellSignals = cryptoRecommendations.filter(r => r.signal?.action === 'SELL').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <p className="text-xs text-muted-foreground">PREDICTION MARKETS</p>
            </div>
            <p className="text-sm text-muted-foreground">Total Markets</p>
            <p className="text-2xl font-bold text-foreground">{dashboardData?.total_markets || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <p className="text-xs text-muted-foreground">PREDICTION MARKETS</p>
            </div>
            <p className="text-sm text-muted-foreground">High Edge Signals</p>
            <p className="text-2xl font-bold text-success">{dashboardData?.high_edge_count || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-warning rounded-full"></span>
              <p className="text-xs text-muted-foreground">CRYPTO</p>
            </div>
            <p className="text-sm text-muted-foreground">Active Signals</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{cryptoRecommendations.length}</p>
              <span className="text-xs">
                <span className="text-success">{buySignals} BUY</span>
                <span className="text-muted-foreground mx-1">|</span>
                <span className="text-destructive">{sellSignals} SELL</span>
              </span>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-warning rounded-full"></span>
              <p className="text-xs text-muted-foreground">CRYPTO PORTFOLIO</p>
            </div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
            {cryptoSummary ? (
              <p className={`text-2xl font-bold ${cryptoSummary.total_pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {cryptoSummary.total_pnl >= 0 ? '+' : ''}${cryptoSummary.total_pnl?.toFixed(2) || '0.00'}
              </p>
            ) : (
              <p className="text-2xl font-bold text-muted-foreground">$0.00</p>
            )}
          </Card>
        </div>

        {/* Portfolio Stats Row */}
        {cryptoSummary && (cryptoSummary.open_positions > 0 || cryptoSummary.winning_trades > 0) && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-card/50">
              <p className="text-xs text-muted-foreground">Open Positions</p>
              <p className="text-xl font-bold text-foreground">{cryptoSummary.open_positions}</p>
            </Card>
            <Card className="p-4 bg-card/50">
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-xl font-bold text-foreground">{cryptoSummary.win_rate}%</p>
            </Card>
            <Card className="p-4 bg-card/50">
              <p className="text-xs text-muted-foreground">W/L Trades</p>
              <p className="text-xl font-bold">
                <span className="text-success">{cryptoSummary.winning_trades}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-destructive">{cryptoSummary.losing_trades}</span>
              </p>
            </Card>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Prediction Markets Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Prediction Markets
              </h2>
              <Link to="/recommendations" className="text-primary hover:text-primary/80 text-sm">
                View all →
              </Link>
            </div>
            
            {isLoading ? (
              <Card className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </Card>
            ) : marketRecommendations.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-muted-foreground">No recommendations yet</p>
                <Link to="/recommendations" className="text-primary text-sm mt-2 inline-block">
                  Run analysis →
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {marketRecommendations.slice(0, 4).map((rec, i) => (
                  <RecommendationCard 
                    key={rec.id || i} 
                    recommendation={rec}
                    onViewAnalysis={(r) => { setSelectedMarketRec(r); setShowAnalysisModal(true); }}
                    onExecute={(r) => { setTradeRec(r); setShowTradeModal(true); }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Crypto Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                Crypto Trading
              </h2>
              <Link to="/crypto" className="text-warning hover:text-warning/80 text-sm">
                View all →
              </Link>
            </div>
            
            {cryptoRecommendations.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-muted-foreground">No crypto signals yet</p>
                <Link to="/crypto" className="text-warning text-sm mt-2 inline-block">
                  Run analysis →
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {cryptoRecommendations.slice(0, 3).map((rec, i) => (
                  <CryptoCard 
                    key={rec.symbol || i} 
                    recommendation={rec}
                    onViewAnalysis={(r) => { setSelectedCryptoRec(r); setShowCryptoModal(true); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => { setShowAnalysisModal(false); setSelectedMarketRec(null); }}
        recommendation={selectedMarketRec}
        onExecute={(r) => { setTradeRec(r); setShowTradeModal(true); setShowAnalysisModal(false); }}
      />
      <CryptoAnalysisModal
        isOpen={showCryptoModal}
        onClose={() => { setShowCryptoModal(false); setSelectedCryptoRec(null); }}
        recommendation={selectedCryptoRec}
        onPositionAdded={loadData}
      />
      <TradeModal
        isOpen={showTradeModal}
        onClose={() => { setShowTradeModal(false); setTradeRec(null); }}
        recommendation={tradeRec}
      />
    </DashboardLayout>
  );
}
