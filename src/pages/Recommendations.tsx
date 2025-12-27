import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import TradeModal from '@/components/dashboard/TradeModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { recommendationsApi } from '@/lib/api';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [minEdge, setMinEdge] = useState('0');
  const [sortBy, setSortBy] = useState('best_buy');
  const [riskLevel, setRiskLevel] = useState('all');

  // Modal states
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [tradeRec, setTradeRec] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [minEdge, sortBy, riskLevel]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await recommendationsApi.list(
        parseInt(minEdge), 
        50, 
        sortBy, 
        riskLevel !== 'all' ? riskLevel : undefined
      );
      setRecommendations(data as any[]);
    } catch (e: any) {
      setError(e.message || 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Market Signals</h1>
            <p className="text-muted-foreground text-xs">
              AI-powered Kalshi market analysis | Auto-updates every 30 minutes
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best_buy">Best Buy (Underpriced)</SelectItem>
                <SelectItem value="best_sell">Best Sell (Overpriced)</SelectItem>
                <SelectItem value="score">Best Opportunity</SelectItem>
                <SelectItem value="edge">Highest Edge %</SelectItem>
                <SelectItem value="confidence">Highest Confidence</SelectItem>
                <SelectItem value="kelly">Highest Kelly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={minEdge} onValueChange={setMinEdge}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Min Edge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All</SelectItem>
                <SelectItem value="2">2%+</SelectItem>
                <SelectItem value="5">5%+</SelectItem>
                <SelectItem value="10">10%+</SelectItem>
                <SelectItem value="20">20%+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low Only</SelectItem>
                <SelectItem value="medium">Medium Only</SelectItem>
                <SelectItem value="high">High Only</SelectItem>
                <SelectItem value="extreme">Extreme Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={loadRecommendations} variant="secondary" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </Card>
        ) : error ? (
          <Card className="bg-destructive/10 border-destructive text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadRecommendations} className="mt-4">Retry</Button>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground">No recommendations found with edge &gt; {minEdge}%</p>
            <p className="text-sm text-muted-foreground mt-2">Try lowering the minimum edge filter</p>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard 
                  key={rec.id || i}
                  recommendation={rec}
                  onViewAnalysis={(r) => { setSelectedRec(r); setShowAnalysisModal(true); }}
                  onExecute={(r) => { setTradeRec(r); setShowTradeModal(true); }}
                />
              ))}
            </div>
            
            <p className="text-center text-muted-foreground text-sm mt-6">
              Showing {recommendations.length} recommendations
            </p>
          </>
        )}
      </div>

      {/* Modals */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => { setShowAnalysisModal(false); setSelectedRec(null); }}
        recommendation={selectedRec}
        onExecute={(r) => { setTradeRec(r); setShowTradeModal(true); setShowAnalysisModal(false); }}
      />
      <TradeModal
        isOpen={showTradeModal}
        onClose={() => { setShowTradeModal(false); setTradeRec(null); }}
        recommendation={tradeRec}
      />
    </DashboardLayout>
  );
}
