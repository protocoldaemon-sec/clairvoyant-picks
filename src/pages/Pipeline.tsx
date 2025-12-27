import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/config';
import { dashboardApi } from '@/lib/api';

interface PipelineRun {
  pipeline_id: string;
  status: string;
  started_at: string;
  markets_processed: number;
  recommendations_generated: number;
}

interface CryptoStats {
  total: number;
  buy: number;
  sell: number;
  hold: number;
  lastRun: Date | null;
}

interface MarketStats {
  total: number;
  buy: number;
  sell: number;
}

const cryptoSteps = [
  { id: 'fetch', name: 'Price Fetch' },
  { id: 'technical', name: 'Technical Analysis' },
  { id: 'monte_carlo', name: 'Monte Carlo' },
  { id: 'signal', name: 'Signal Generator' },
  { id: 'position', name: 'Position Sizer' }
];

const marketSteps = [
  { id: 'fetch', name: 'Market Fetch' },
  { id: 'enrich', name: 'Data Enricher' },
  { id: 'volatility', name: 'Volatility Analysis' },
  { id: 'monte_carlo', name: 'Monte Carlo' },
  { id: 'position', name: 'Position Sizer' },
  { id: 'decision', name: 'Decision Router' }
];

export default function Pipeline() {
  const [pipelineHistory, setPipelineHistory] = useState<PipelineRun[]>([]);
  const [cryptoStats, setCryptoStats] = useState<CryptoStats | null>(null);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [isRunningCrypto, setIsRunningCrypto] = useState(false);
  const [isRunningMarket, setIsRunningMarket] = useState(false);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadCryptoStats(),
      loadMarketStats(),
      loadHistory()
    ]);
  };

  const loadHistory = async () => {
    try {
      const result = await dashboardApi.getPipelineHistory(10) as { runs?: PipelineRun[] };
      setPipelineHistory(result.runs || []);
    } catch (e) {
      console.error('Failed to load pipeline history:', e);
    }
  };

  const loadCryptoStats = async () => {
    try {
      const res = await fetch(`${API_URL}/crypto/recommendations?limit=50`);
      if (res.ok) {
        const data = await res.json();
        const latestTime = data[0]?.created_at ? new Date(data[0].created_at) : null;
        setCryptoStats({
          total: data.length,
          buy: data.filter((r: any) => r.signal?.action === 'BUY').length,
          sell: data.filter((r: any) => r.signal?.action === 'SELL').length,
          hold: data.filter((r: any) => r.signal?.action === 'HOLD').length,
          lastRun: latestTime
        });
      }
    } catch (e) {
      console.error('Failed to load crypto stats:', e);
    }
  };

  const loadMarketStats = async () => {
    try {
      const res = await fetch(`${API_URL}/recommendations?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setMarketStats({
          total: data.length || 0,
          buy: data.filter((r: any) => r.action === 'BUY_YES').length,
          sell: data.filter((r: any) => r.action === 'SELL_NO').length
        });
      } else {
        setMarketStats({ total: 0, buy: 0, sell: 0 });
      }
    } catch (e) {
      console.error('Failed to load market stats:', e);
      setMarketStats({ total: 0, buy: 0, sell: 0 });
    }
  };

  const runCryptoPipeline = async () => {
    setIsRunningCrypto(true);
    try {
      await fetch(`${API_URL}/crypto/analyze`, { method: 'POST' });
      setTimeout(async () => {
        await loadCryptoStats();
        setIsRunningCrypto(false);
      }, 5000);
    } catch (e) {
      console.error('Failed to run crypto pipeline:', e);
      setIsRunningCrypto(false);
    }
  };

  const runMarketPipeline = async () => {
    setIsRunningMarket(true);
    try {
      await fetch(`${API_URL}/pipeline/trigger`, { method: 'POST' });
      setTimeout(async () => {
        await loadMarketStats();
        await loadHistory();
        setIsRunningMarket(false);
      }, 10000);
    } catch (e) {
      console.error('Failed to run market pipeline:', e);
      setIsRunningMarket(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Pipeline Monitor</h1>

        {/* Two Pipeline Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Crypto Pipeline */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className={`w-3 h-3 bg-yellow-500 rounded-full ${isRunningCrypto ? 'animate-pulse' : ''}`}></span>
                Crypto Pipeline
              </h2>
              <Button 
                onClick={runCryptoPipeline}
                disabled={isRunningCrypto}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-500 text-white"
              >
                {isRunningCrypto ? 'Running...' : 'Run Now'}
              </Button>
            </div>
            
            {/* Flow Visualization */}
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
              {cryptoSteps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ${isRunningCrypto ? 'animate-pulse bg-yellow-600/30' : ''}`}>
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-center whitespace-nowrap">{step.name}</p>
                  </div>
                  {i < cryptoSteps.length - 1 && (
                    <div className="w-4 h-0.5 bg-slate-600 mx-1"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Stats */}
            {cryptoStats && (
              <>
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{cryptoStats.total}</p>
                    <p className="text-xs text-slate-500">Signals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-400">{cryptoStats.buy}</p>
                    <p className="text-xs text-slate-500">BUY</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-red-400">{cryptoStats.sell}</p>
                    <p className="text-xs text-slate-500">SELL</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-400">{cryptoStats.hold}</p>
                    <p className="text-xs text-slate-500">HOLD</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Last run: {cryptoStats.lastRun ? timeSince(cryptoStats.lastRun) : 'Never'} • Auto: every 5 min
                </p>
              </>
            )}
          </Card>

          {/* Market Pipeline */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className={`w-3 h-3 bg-primary-500 rounded-full ${isRunningMarket ? 'animate-pulse' : ''}`}></span>
                Market Pipeline
              </h2>
              <Button 
                onClick={runMarketPipeline}
                disabled={isRunningMarket}
                size="sm"
                className="bg-primary-600 hover:bg-primary-500 text-white"
              >
                {isRunningMarket ? 'Running...' : 'Run Now'}
              </Button>
            </div>
            
            {/* Flow Visualization */}
            <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
              {marketSteps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <div className={`w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center ${isRunningMarket ? 'animate-pulse bg-primary-600/30' : ''}`}>
                      <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-center whitespace-nowrap">{step.name}</p>
                  </div>
                  {i < marketSteps.length - 1 && (
                    <div className="w-3 h-0.5 bg-slate-600 mx-0.5"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{marketStats?.total || 0}</p>
                <p className="text-xs text-slate-500">Signals</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">{marketStats?.buy || 0}</p>
                <p className="text-xs text-slate-500">BUY</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-400">{marketStats?.sell || 0}</p>
                <p className="text-xs text-slate-500">SELL</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Auto: every 10 min
            </p>
          </Card>
        </div>

        {/* Pipeline History */}
        <h2 className="text-lg font-semibold text-white mb-4">Recent Pipeline Runs</h2>
        
        {pipelineHistory.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 text-center py-8">
            <p className="text-slate-400">No pipeline runs recorded yet</p>
            <p className="text-sm text-slate-500 mt-2">Click "Run Now" to trigger a pipeline</p>
          </Card>
        ) : (
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr className="text-left text-sm text-slate-400">
                  <th className="px-4 py-3">Pipeline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 text-right">Processed</th>
                  <th className="px-4 py-3 text-right">Signals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {pipelineHistory.map((run, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 font-mono text-sm text-white">
                      {run.pipeline_id?.slice(0, 8) || 'N/A'}...
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        run.status === 'COMPLETED' 
                          ? 'bg-green-500/20 text-green-400' 
                          : run.status === 'FAILED' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {formatDate(run.started_at)}
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {run.markets_processed || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-green-400">
                      {run.recommendations_generated || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
