import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CryptoCard from '@/components/dashboard/CryptoCard';
import CryptoAnalysisModal from '@/components/dashboard/CryptoAnalysisModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface Price {
  symbol: string;
  price: number;
  change_24h_pct: number;
}

export default function Crypto() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Filters
  const [actionFilter, setActionFilter] = useState('all');
  const [minConfidence, setMinConfidence] = useState('0');

  // Modal
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(recommendations.length === 0);
    setError('');
    try {
      await Promise.all([loadPrices(), loadRecommendations()]);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      const res = await fetch(`${API_URL}/crypto/prices`);
      if (res.ok) {
        setPrices(await res.json());
      }
    } catch (e) {
      console.error('Failed to load prices:', e);
    }
  };

  const loadRecommendations = async () => {
    try {
      let url = `${API_URL}/crypto/recommendations?limit=20`;
      if (actionFilter && actionFilter !== 'all') url += `&action=${actionFilter}`;
      if (parseInt(minConfidence) > 0) url += `&min_confidence=${parseInt(minConfidence) / 100}`;
      
      const res = await fetch(url);
      if (res.ok) {
        setRecommendations(await res.json());
      }
    } catch (e) {
      console.error('Failed to load recommendations:', e);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [actionFilter, minConfidence]);

  const getPrice = (symbol: string): Price | undefined => {
    return prices.find(p => p.symbol === symbol);
  };

  const buyCount = recommendations.filter(r => r.signal?.action === 'BUY').length;
  const sellCount = recommendations.filter(r => r.signal?.action === 'SELL').length;
  const holdCount = recommendations.filter(r => r.signal?.action === 'HOLD').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crypto Trading</h1>
            <p className="text-muted-foreground text-xs">
              AI-powered analysis | Auto-updates every 5 minutes
              {lastUpdated && ` | Last: ${lastUpdated.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Signal Stats */}
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-success/20 text-success rounded">{buyCount} BUY</span>
              <span className="px-2 py-1 bg-destructive/20 text-destructive rounded">{sellCount} SELL</span>
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded">{holdCount} HOLD</span>
            </div>
            
            <div className="h-6 w-px bg-border hidden md:block"></div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Signals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="BUY">BUY Only</SelectItem>
                <SelectItem value="SELL">SELL Only</SelectItem>
                <SelectItem value="HOLD">HOLD Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={minConfidence} onValueChange={setMinConfidence}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Min Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                <SelectItem value="50">50%+</SelectItem>
                <SelectItem value="60">60%+</SelectItem>
                <SelectItem value="70">70%+</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={loadData} variant="secondary" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            
            <Link to="/crypto/portfolio">
              <Button className="bg-warning hover:bg-warning/90 text-warning-foreground">
                Portfolio
              </Button>
            </Link>
          </div>
        </div>

        {/* Price Ticker */}
        {prices.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {prices.map((price) => (
                <Card key={price.symbol} className="flex-shrink-0 px-4 py-2 min-w-[140px]">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">{price.symbol.replace('USDT', '')}</span>
                    <span className={`text-xs ${price.change_24h_pct >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {price.change_24h_pct >= 0 ? '+' : ''}{price.change_24h_pct?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    ${price.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <Card className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </Card>
        ) : error ? (
          <Card className="bg-destructive/10 border-destructive text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadData} className="mt-4">Retry</Button>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground">No crypto signals available yet</p>
            <p className="text-sm text-muted-foreground mt-2">Analysis runs automatically every 5 minutes</p>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <CryptoCard 
                  key={rec.symbol || i}
                  recommendation={rec}
                  price={getPrice(rec.symbol)}
                  onViewAnalysis={(r) => { setSelectedCrypto(r); setShowModal(true); }}
                />
              ))}
            </div>
            
            <p className="text-center text-muted-foreground text-sm mt-6">
              {recommendations.length} signals • Analysis updates every 5 minutes
            </p>
          </>
        )}
      </div>

      <CryptoAnalysisModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedCrypto(null); }}
        recommendation={selectedCrypto}
        onPositionAdded={loadData}
      />
    </DashboardLayout>
  );
}
