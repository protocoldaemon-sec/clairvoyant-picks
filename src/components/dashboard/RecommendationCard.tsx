import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/date';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Recommendation {
  id?: string;
  ticker: string;
  title?: string;
  market_price?: number;
  target_price?: number;
  edge_pct?: number;
  action?: string;
  kelly_criterion?: number;
  confidence?: number;
  risk_level?: string;
  ai_reasoning?: string;
  risk_factors?: string[];
  created_at?: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onExecute?: (rec: Recommendation) => void;
  onViewAnalysis?: (rec: Recommendation) => void;
}

export default function RecommendationCard({ recommendation, onExecute, onViewAnalysis }: RecommendationCardProps) {
  const edgePct = recommendation?.edge_pct ?? 0;
  const confidence = recommendation?.confidence ?? 0;
  const marketPrice = recommendation?.market_price ?? 0;
  const targetPrice = recommendation?.target_price ?? 0;
  const kellyCriterion = recommendation?.kelly_criterion ?? 0;
  const action = recommendation?.action ?? 'AVOID';
  const riskLevel = recommendation?.risk_level ?? 'medium';
  const aiReasoning = recommendation?.ai_reasoning ?? '';
  const createdAt = recommendation?.created_at ?? null;

  const getActionColor = (act: string): string => {
    switch (act) {
      case 'BUY_YES': return 'text-success';
      case 'SELL_NO': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getActionLabel = (act: string): string => {
    switch (act) {
      case 'BUY_YES': return 'BUY YES';
      case 'SELL_NO': return 'SELL NO';
      default: return 'AVOID';
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'extreme': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <p className="text-xs text-muted-foreground font-medium mb-1">{recommendation?.ticker ?? 'Unknown'}</p>
          <h3 className="font-semibold text-foreground text-sm line-clamp-2">{recommendation?.title ?? ''}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span 
            className={cn(
              'px-2 py-1 rounded text-xs font-medium bg-muted flex items-center gap-1',
              getActionColor(action)
            )}
          >
            {action === 'BUY_YES' && <TrendingUp className="w-3 h-3" />}
            {action === 'SELL_NO' && <TrendingDown className="w-3 h-3" />}
            {getActionLabel(action)}
          </span>
          <span className={cn('px-2 py-0.5 rounded text-xs', getRiskColor(riskLevel))}>
            {riskLevel.toUpperCase()} RISK
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Edge {action === 'BUY_YES' ? '(Underpriced)' : action === 'SELL_NO' ? '(Overpriced)' : ''}
          </p>
          <p className={cn(
            'text-lg font-bold',
            action === 'BUY_YES' ? 'text-success' : action === 'SELL_NO' ? 'text-warning' : 'text-muted-foreground'
          )}>
            {Math.abs(edgePct).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">AI Confidence</p>
          <p className="text-lg font-bold text-primary-400">
            {(confidence * 100).toFixed(0)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Market Price</p>
          <p className="text-foreground">${marketPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">AI Target</p>
          <p className="text-foreground">${targetPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded p-2 mb-3">
        <p className="text-xs text-muted-foreground mb-1">AI Analysis</p>
        <p className={cn(
          'text-xs line-clamp-2 h-8',
          aiReasoning ? 'text-foreground' : 'text-muted-foreground italic'
        )}>
          {aiReasoning || 'No AI analysis available for this market'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={() => onViewAnalysis?.(recommendation)} 
          className="text-xs text-primary-400 hover:text-primary-300 underline"
        >
          View Analysis
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Kelly: {(kellyCriterion * 100).toFixed(1)}%
          </span>
          {createdAt && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(createdAt)}
            </span>
          )}
          {action !== 'AVOID' && (
            <Button 
              onClick={() => onExecute?.(recommendation)} 
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Execute
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
