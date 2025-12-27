import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/date';

interface CryptoRecommendation {
  name: string;
  symbol: string;
  current_price?: number;
  created_at?: string;
  signal?: {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    strength: 'STRONG' | 'MODERATE' | 'WEAK';
    reasons?: string[];
  };
  position?: {
    entry_price?: number;
    stop_loss?: number;
    take_profit_1?: number;
  };
  simulation?: {
    upside_prob: number;
  };
  indicators?: {
    rsi?: number;
  };
}

interface CryptoCardProps {
  recommendation: CryptoRecommendation;
  price?: { price: number; change_24h_pct: number };
  onViewAnalysis?: (rec: CryptoRecommendation) => void;
}

export default function CryptoCard({ recommendation, price, onViewAnalysis }: CryptoCardProps) {
  const signal = recommendation?.signal ?? { action: 'HOLD', confidence: 0, strength: 'WEAK' };
  const position = recommendation?.position ?? {};
  const simulation = recommendation?.simulation ?? { upside_prob: 0 };
  const indicators = recommendation?.indicators ?? {};
  const currentPrice = price?.price ?? recommendation?.current_price ?? 0;
  const change24h = price?.change_24h_pct ?? 0;

  const actionColorClass = signal.action === 'BUY' 
    ? 'text-success bg-success/20' 
    : signal.action === 'SELL' 
      ? 'text-destructive bg-destructive/20' 
      : 'text-muted-foreground bg-muted';

  const strengthColorClass = signal.strength === 'STRONG'
    ? 'text-success'
    : signal.strength === 'MODERATE'
      ? 'text-warning'
      : 'text-muted-foreground';

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{recommendation.name}</h3>
          <p className="text-sm text-muted-foreground">{recommendation.symbol}</p>
          {recommendation?.created_at && (
            <p className="text-xs text-muted-foreground">{formatRelativeTime(recommendation.created_at)}</p>
          )}
        </div>
        <Badge className={cn('px-3 py-1 rounded-full text-sm font-bold border-0', actionColorClass)}>
          {signal.action}
        </Badge>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">
          ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
        <div className={cn('text-sm', change24h >= 0 ? 'text-success' : 'text-destructive')}>
          {change24h >= 0 ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}% (24h)
        </div>
      </div>

      {/* Signal Info */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground">Confidence</p>
          <p className="text-foreground font-medium">{(signal.confidence * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Strength</p>
          <p className={cn('font-medium', strengthColorClass)}>{signal.strength}</p>
        </div>
        <div>
          <p className="text-muted-foreground">RSI</p>
          <p className="text-foreground font-medium">{indicators.rsi?.toFixed(1) ?? '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Upside Prob</p>
          <p className="text-foreground font-medium">{(simulation.upside_prob * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Position Info (if BUY/SELL) */}
      {signal.action !== 'HOLD' && position.stop_loss && (
        <div className="bg-slate-700/30 rounded p-3 mb-4 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-slate-500 text-xs">Entry</p>
              <p className="text-white">${position.entry_price?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Stop Loss</p>
              <p className="text-red-400">${position.stop_loss?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Take Profit</p>
              <p className="text-green-400">${position.take_profit_1?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reasons */}
      {signal.reasons && signal.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {signal.reasons.map((reason, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
              {reason}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <button 
        onClick={() => onViewAnalysis?.(recommendation)}
        className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors"
      >
        View Analysis
      </button>
    </Card>
  );
}
