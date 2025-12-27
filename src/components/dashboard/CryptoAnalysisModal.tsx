import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/date';
import { API_URL } from '@/lib/config';
import { useAuth } from '@/components/AuthProvider';
import CryptoChart from './CryptoChart';

interface CryptoRecommendation {
  name: string;
  symbol: string;
  current_price?: number;
  created_at?: string;
  signal?: {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    strength: string;
    indicator_signals?: Record<string, string>;
    reasons?: string[];
  };
  position?: {
    entry_price?: number;
    stop_loss?: number;
    take_profit_1?: number;
  };
  simulation?: {
    upside_prob?: number;
    expected_return_pct?: number;
    var_95?: number;
    volatility_annual?: number;
    price_targets?: {
      bull_case?: number;
      base_case?: number;
      bear_case?: number;
    };
  };
  indicators?: {
    rsi?: number;
    macd?: { histogram?: number };
    bollinger?: { percent_b?: number };
    ema_trend?: string;
    ema_9?: number;
    ema_21?: number;
    ema_50?: number;
    atr?: number;
    atr_pct?: number;
  };
  ai_analysis?: string;
  news_articles?: Array<{
    title: string;
    url: string;
    source_name?: string;
    source?: string;
  }>;
}

interface ExistingPosition {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entry_price: number;
  pnl: number;
  pnl_pct: number;
  status: string;
}

interface CryptoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: CryptoRecommendation | null;
  onPositionAdded?: () => void;
}

export default function CryptoAnalysisModal({ isOpen, onClose, recommendation, onPositionAdded }: CryptoAnalysisModalProps) {
  const { user, refreshUser } = useAuth();
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [addError, setAddError] = useState('');
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'BUY' | 'SELL' | ''>('');
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState('');
  const [existingPosition, setExistingPosition] = useState<ExistingPosition | null>(null);
  
  // Realtime price
  const [livePrice, setLivePrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  
  // Trade inputs
  const [quantity, setQuantity] = useState(1);
  const [customStopLoss, setCustomStopLoss] = useState(0);
  const [customTakeProfit, setCustomTakeProfit] = useState(0);
  const [balanceType, setBalanceType] = useState<'simulation' | 'real'>('simulation');

  // User balance
  const simulationBalance = (user as any)?.balance?.simulation ?? 10000;

  // Current price - use live price if available
  const currentPrice = livePrice > 0 ? livePrice : (recommendation?.current_price ?? 0);
  const totalValue = currentPrice * quantity;

  // Fetch realtime price
  const fetchRealtimePrice = async () => {
    if (!recommendation?.symbol) return;
    setPriceLoading(true);
    try {
      const res = await fetch(`${API_URL}/crypto/prices/${recommendation.symbol}`);
      if (res.ok) {
        const data = await res.json();
        setLivePrice(data.price);
      }
    } catch (e) {
      console.error('Failed to fetch realtime price:', e);
    } finally {
      setPriceLoading(false);
    }
  };

  // Check existing position
  const checkExistingPosition = async () => {
    if (!recommendation?.symbol) return;
    setExistingPosition(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/crypto/positions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const positions = await res.json();
        const existing = positions.find((p: ExistingPosition) => 
          p.symbol === recommendation.symbol && p.status === 'OPEN'
        );
        setExistingPosition(existing || null);
      }
    } catch (e) {
      console.error('Failed to check positions:', e);
    }
  };

  useEffect(() => {
    if (isOpen && recommendation) {
      const basePrice = recommendation.current_price ?? 0;
      setCustomStopLoss(recommendation.position?.stop_loss || basePrice * 0.95);
      setCustomTakeProfit(recommendation.position?.take_profit_1 || basePrice * 1.05);
      setShowTradeForm(false);
      setSelectedAction('');
      setShowWarning(false);
      setAddError('');
      setLivePrice(0);
      checkExistingPosition();
      fetchRealtimePrice();
    }
  }, [isOpen, recommendation]);

  if (!recommendation) return null;

  const symbol = recommendation.symbol ?? '';
  const name = recommendation.name ?? '';
  const signal = recommendation.signal ?? { action: 'HOLD', confidence: 0, strength: 'WEAK' };
  const indicators = recommendation.indicators ?? {};
  const simulation = recommendation.simulation ?? {};
  const position = recommendation.position ?? {};
  const newsArticles = recommendation.news_articles ?? [];
  const aiAnalysis = recommendation.ai_analysis ?? '';
  const createdAt = recommendation.created_at ? new Date(recommendation.created_at) : null;

  const holdDisplayText = existingPosition ? 'HOLD (Keep Position)' : 'WAIT (No Clear Signal)';

  const handleTradeClick = (action: 'BUY' | 'SELL') => {
    if (!showTradeForm) {
      setShowTradeForm(true);
      setSelectedAction(action);
      return;
    }

    const signalAction = signal.action;
    if (signalAction !== action && signalAction !== 'HOLD') {
      setShowWarning(true);
      setPendingAction(action);
    } else if (signalAction === 'HOLD') {
      setShowWarning(true);
      setPendingAction(action);
    } else {
      addToPortfolio(action);
    }
  };

  const confirmTrade = () => {
    if (pendingAction) {
      addToPortfolio(pendingAction as 'BUY' | 'SELL');
    }
    setShowWarning(false);
    setPendingAction('');
  };

  const addToPortfolio = async (action: 'BUY' | 'SELL') => {
    setIsAddingPosition(true);
    setAddError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAddError('Please login first');
        return;
      }

      const res = await fetch(`${API_URL}/crypto/positions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: recommendation.symbol,
          name: recommendation.name,
          side: action,
          entry_price: currentPrice,
          quantity,
          stop_loss: customStopLoss,
          take_profit: customTakeProfit,
          balance_type: balanceType,
          notes: `Signal: ${signal.action}, Confidence: ${(signal.confidence * 100).toFixed(0)}%`
        })
      });

      if (res.ok) {
        await refreshUser();
        onPositionAdded?.();
        onClose();
      } else {
        const data = await res.json();
        setAddError(data.detail || 'Failed to add position');
      }
    } catch (e: any) {
      setAddError(e.message || 'Failed to add position');
    } finally {
      setIsAddingPosition(false);
    }
  };

  const actionColor = signal.action === 'BUY' ? 'text-success' : signal.action === 'SELL' ? 'text-destructive' : 'text-warning';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div>
              <DialogTitle className="text-xl">{name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{symbol}</p>
              {createdAt && (
                <p className="text-xs text-muted-foreground">Analyzed: {formatDateTime(createdAt)}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Signal</p>
                <p className={cn('text-xl font-bold', actionColor)}>{signal.action}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="text-xl font-bold">{(signal.confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Strength</p>
                <p className="text-lg font-bold">{signal.strength}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4 p-4 overflow-hidden flex-1">
          {/* Left: Chart */}
          <div className="flex-1 flex flex-col min-w-0">
            <CryptoChart symbol={symbol} />
          </div>

          {/* Right: Info panels */}
          <div className="w-96 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-hidden">
            {/* Price & Position */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-xs text-muted-foreground mb-2">PRICE & POSITION</h4>
              <div className="text-2xl font-bold mb-2">
                ${currentPrice.toLocaleString()}
                {priceLoading && <span className="text-xs text-muted-foreground ml-2">updating...</span>}
              </div>
              {signal.action !== 'HOLD' && position.stop_loss && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Stop Loss</p>
                    <p className="text-destructive font-medium">${position.stop_loss?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Take Profit</p>
                    <p className="text-success font-medium">${position.take_profit_1?.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Technical Indicators */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-xs text-muted-foreground mb-2">TECHNICAL INDICATORS</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">RSI (14)</p>
                  <p className="font-medium">{indicators.rsi?.toFixed(1) ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">MACD</p>
                  <p className={cn('font-medium', (indicators.macd?.histogram || 0) > 0 ? 'text-success' : 'text-destructive')}>
                    {indicators.macd?.histogram?.toFixed(4) ?? '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bollinger %B</p>
                  <p className="font-medium">{indicators.bollinger?.percent_b?.toFixed(2) ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">EMA Trend</p>
                  <p className={cn(
                    'font-medium',
                    indicators.ema_trend === 'BULLISH' ? 'text-success' : indicators.ema_trend === 'BEARISH' ? 'text-destructive' : ''
                  )}>
                    {indicators.ema_trend ?? '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Monte Carlo */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-xs text-muted-foreground mb-2">MONTE CARLO (24H)</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Upside Prob</p>
                  <p className={cn('font-medium', (simulation.upside_prob || 0) > 0.5 ? 'text-success' : 'text-destructive')}>
                    {((simulation.upside_prob || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Expected Return</p>
                  <p className={cn('font-medium', (simulation.expected_return_pct || 0) > 0 ? 'text-success' : 'text-destructive')}>
                    {(simulation.expected_return_pct || 0) > 0 ? '+' : ''}{simulation.expected_return_pct?.toFixed(2) ?? '0'}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">VaR 95%</p>
                  <p className="text-destructive font-medium">${simulation.var_95?.toLocaleString() ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Volatility</p>
                  <p className="font-medium">{((simulation.volatility_annual || 0) * 100).toFixed(1)}%</p>
                </div>
              </div>
              {simulation.price_targets && (
                <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                  <div className="bg-success/20 rounded p-1 text-center">
                    <p className="text-muted-foreground">Bull</p>
                    <p className="text-success">${simulation.price_targets.bull_case?.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded p-1 text-center">
                    <p className="text-muted-foreground">Base</p>
                    <p>${simulation.price_targets.base_case?.toLocaleString()}</p>
                  </div>
                  <div className="bg-destructive/20 rounded p-1 text-center">
                    <p className="text-muted-foreground">Bear</p>
                    <p className="text-destructive">${simulation.price_targets.bear_case?.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Signal Breakdown */}
            {signal.indicator_signals && (
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="text-xs text-muted-foreground mb-2">SIGNAL BREAKDOWN</h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(signal.indicator_signals).map(([ind, val]) => (
                    <div key={ind} className="flex justify-between">
                      <span className="text-muted-foreground">{ind}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMA Values */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="text-xs text-muted-foreground mb-2">EMA VALUES</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">EMA 9</p>
                  <p className="text-foreground">${indicators.ema_9?.toLocaleString() ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EMA 21</p>
                  <p className="text-foreground">${indicators.ema_21?.toLocaleString() ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EMA 50</p>
                  <p className="text-foreground">${indicators.ema_50?.toLocaleString() ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ATR</p>
                  <p className="text-foreground">${indicators.atr?.toLocaleString() ?? '-'} ({indicators.atr_pct?.toFixed(1) ?? '0'}%)</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="text-xs text-muted-foreground mb-2">AI ANALYSIS</h4>
                <p className="text-sm">{aiAnalysis}</p>
              </div>
            )}

            {/* News */}
            {newsArticles.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-3">
                <h4 className="text-xs text-muted-foreground mb-2">📰 RELATED NEWS</h4>
                <div className="space-y-2">
                  {newsArticles.map((article, i) => (
                    <a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:bg-muted/50 rounded p-2 transition-colors"
                    >
                      <p className="text-xs line-clamp-2">{article.title}</p>
                      <span className="text-xs text-muted-foreground">{article.source_name || article.source}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3">
          {/* Existing Position Info */}
          {existingPosition && (
            <div className="mb-3 p-2 bg-blue-500/20 rounded-lg text-sm">
              <span className="text-blue-400">Open {existingPosition.side} position:</span>
              <span className="text-foreground ml-2">{existingPosition.quantity} @ ${existingPosition.entry_price?.toLocaleString()}</span>
              <span className={cn('ml-2', existingPosition.pnl >= 0 ? 'text-success' : 'text-destructive')}>
                ({existingPosition.pnl >= 0 ? '+' : ''}{existingPosition.pnl_pct?.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* Warning */}
          {showWarning && (
            <div className="mb-3 p-3 bg-warning/20 border border-warning/50 rounded-lg">
              <p className="text-warning text-sm font-medium mb-2">⚠️ Warning: Action doesn't match signal</p>
              <p className="text-sm mb-3">
                Signal is <span className={cn('font-bold', actionColor)}>{signal.action === 'HOLD' ? holdDisplayText : signal.action}</span> but you want to <span className="font-bold">{pendingAction}</span>.
                {signal.action === 'HOLD' && (
                  existingPosition ? ' Consider keeping your current position.' : ' No clear trading signal detected.'
                )}
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-warning hover:bg-warning/90" onClick={confirmTrade}>
                  Proceed Anyway
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setShowWarning(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Trade Form */}
          {showTradeForm && !showWarning && (
            <div className="flex flex-wrap items-end gap-4 mb-3 p-3 bg-muted/30 rounded-lg">
              {/* Balance Type */}
              <div>
                <Label className="text-xs">Balance</Label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={balanceType === 'simulation' ? 'default' : 'secondary'}
                    onClick={() => setBalanceType('simulation')}
                    className={balanceType === 'simulation' ? 'bg-blue-600' : ''}
                  >
                    Sim ${simulationBalance.toLocaleString()}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled
                    title="Coming soon"
                  >
                    Real $0
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  min={0.001}
                  step={0.1}
                  className="w-24"
                />
              </div>
              <div>
                <Label className="text-xs">Stop Loss ($)</Label>
                <Input
                  type="number"
                  value={customStopLoss}
                  onChange={(e) => setCustomStopLoss(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
              </div>
              <div>
                <Label className="text-xs">Take Profit ($)</Label>
                <Input
                  type="number"
                  value={customTakeProfit}
                  onChange={(e) => setCustomTakeProfit(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                  className="w-28"
                />
              </div>
              <div>
                <Label className="text-xs">Total Value</Label>
                <div className="bg-muted/50 rounded px-3 py-2 text-sm font-medium">
                  ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTradeForm(false)} className="ml-auto">
                ✕ Cancel
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center">
            {addError ? (
              <p className="text-destructive text-sm">{addError}</p>
            ) : (
              <div className="text-sm text-muted-foreground">
                {signal.action === 'BUY' && <span className="text-success">✓ Recommended: BUY</span>}
                {signal.action === 'SELL' && <span className="text-destructive">✓ Recommended: SELL</span>}
                {signal.action === 'HOLD' && <span className="text-warning">⏸ {holdDisplayText}</span>}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              {showTradeForm ? (
                <Button
                  disabled={isAddingPosition || showWarning}
                  className={selectedAction === 'BUY' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'}
                  onClick={() => handleTradeClick(selectedAction as 'BUY' | 'SELL')}
                >
                  {isAddingPosition ? 'Adding...' : `Confirm ${selectedAction}`}
                </Button>
              ) : (
                <>
                  <Button
                    disabled={isAddingPosition || !existingPosition}
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => handleTradeClick('SELL')}
                    title={!existingPosition ? 'You need an open position to sell' : ''}
                  >
                    Sell
                  </Button>
                  <Button
                    disabled={isAddingPosition}
                    className="bg-success hover:bg-success/90"
                    onClick={() => handleTradeClick('BUY')}
                  >
                    Buy
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
