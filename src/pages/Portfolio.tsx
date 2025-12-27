import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { portfolioApi, tradesApi } from '@/lib/api';

interface Position {
  ticker: string;
  title: string;
  action: string;
  size: number;
  entry_price: number;
  current_price: number;
  pnl: number;
}

interface Trade {
  ticker: string;
  action: string;
  size: number;
  pnl: number;
  executed_at: string;
}

interface PortfolioData {
  total_value: number;
  total_pnl: number;
  total_pnl_pct: number;
  positions: Position[];
}

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const [portfolioData, tradesData] = await Promise.all([
        portfolioApi.get(token).catch(() => null),
        tradesApi.getHistory(token, 20).catch(() => []),
      ]);
      
      setPortfolio(portfolioData as PortfolioData);
      setTrades(tradesData as Trade[]);
    } catch (e) {
      console.error('Failed to load portfolio:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openPositions = portfolio?.positions || [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Portfolio</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold text-foreground">
              ${(portfolio?.total_value || 0).toFixed(2)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={`text-2xl font-bold ${(portfolio?.total_pnl || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(portfolio?.total_pnl || 0) >= 0 ? '+' : ''}${(portfolio?.total_pnl || 0).toFixed(2)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">P&L %</p>
            <p className={`text-2xl font-bold ${(portfolio?.total_pnl_pct || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {(portfolio?.total_pnl_pct || 0) >= 0 ? '+' : ''}{(portfolio?.total_pnl_pct || 0).toFixed(2)}%
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Open Positions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Open Positions</h2>
            
            {isLoading ? (
              <Card className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </Card>
            ) : openPositions.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-muted-foreground">No open positions</p>
                <Link to="/dashboard" className="text-primary text-sm mt-2 inline-block">
                  View recommendations →
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {openPositions.map((position, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{position.ticker}</h3>
                        <p className="text-sm text-muted-foreground">{position.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        position.action.includes('BUY') 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {position.action}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="text-foreground">{position.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entry</p>
                        <p className="text-foreground">${position.entry_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="text-foreground">${position.current_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">P&L</p>
                        <p className={position.pnl >= 0 ? 'text-success' : 'text-destructive'}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Trades */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Trades</h2>
            
            {trades.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-muted-foreground">No trades yet</p>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-3 py-2">Market</th>
                      <th className="px-3 py-2">Action</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {trades.map((trade, i) => (
                      <tr key={i} className="text-sm">
                        <td className="px-3 py-2">
                          <p className="text-foreground">{trade.ticker}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(trade.executed_at)}</p>
                        </td>
                        <td className="px-3 py-2">
                          <span className={trade.action.includes('BUY') ? 'text-success' : 'text-destructive'}>
                            {trade.action}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-foreground">{trade.size}</td>
                        <td className={`px-3 py-2 ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
