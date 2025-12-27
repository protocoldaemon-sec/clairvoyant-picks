import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

// Tooltip texts
const tips = {
  marketPrice: "Current trading price on Kalshi. Represents the market's implied probability.",
  targetPrice: 'AI-estimated fair value based on analysis. Compare with market price to find edge.',
  edge: 'Percentage difference between AI target and market price. Higher = better opportunity.',
  confidence: 'How confident the AI is in its analysis. Based on data quality and model certainty.',
  kelly: 'Optimal bet size as % of bankroll. Maximizes long-term growth while managing risk.',
  expectedReturn: 'Projected return per unit risked, based on edge and win probability.',
  winProb: 'Probability that the final price will be above 50% at expiry.',
  expectedValue: 'Average profit/loss per $1 bet across all scenarios.',
  var95: 'Value at Risk: Worst expected price in 95% of scenarios.',
  cvar95: 'Conditional VaR: Average price in the worst 5% of scenarios.',
  maxDrawdown: 'Largest peak-to-trough decline during the period.',
};

interface Recommendation {
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
  simulation?: {
    model?: string;
    iterations?: number;
    win_probability?: number;
    expected_value?: number;
    var_95?: number;
    cvar_95?: number;
    max_drawdown?: number;
    params?: Record<string, number>;
    prob_distribution?: Record<string, number>;
  };
  news_articles?: Array<{
    title: string;
    url: string;
    description?: string;
    source_name?: string;
    source?: string;
    published?: string;
  }>;
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
  onExecute?: (rec: Recommendation) => void;
}

export default function AnalysisModal({ isOpen, onClose, recommendation, onExecute }: AnalysisModalProps) {
  if (!recommendation) return null;

  const ticker = recommendation.ticker ?? '';
  const title = recommendation.title ?? '';
  const marketPrice = recommendation.market_price ?? 0;
  const targetPrice = recommendation.target_price ?? 0;
  const edgePct = recommendation.edge_pct ?? 0;
  const action = recommendation.action ?? 'AVOID';
  const kelly = recommendation.kelly_criterion ?? 0;
  const confidence = recommendation.confidence ?? 0;
  const riskLevel = recommendation.risk_level ?? 'medium';
  const aiReasoning = recommendation.ai_reasoning ?? '';
  const riskFactors = recommendation.risk_factors ?? [];
  const simulation = recommendation.simulation ?? {};
  const newsArticles = recommendation.news_articles ?? [];

  const expectedReturn = edgePct > 0 ? (kelly * edgePct).toFixed(2) : '0.00';

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-orange-500';
      case 'extreme': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskExplanation = (risk: string) => {
    switch (risk) {
      case 'low': return 'Low volatility, suitable for larger positions.';
      case 'medium': return 'Moderate uncertainty. Standard position sizing.';
      case 'high': return 'High volatility. Reduce position size by 50%.';
      case 'extreme': return 'Very speculative. Maximum 25% of normal size.';
      default: return 'Risk level not assessed.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
          <DialogTitle className="text-xl">{ticker}</DialogTitle>
          <p className="text-sm text-muted-foreground">{title}</p>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 scrollbar-hidden">
          {/* Action Summary */}
          <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Recommended Action</p>
              <p className={cn(
                'text-2xl font-bold',
                action === 'BUY_YES' ? 'text-success' : action === 'SELL_NO' ? 'text-warning' : 'text-muted-foreground'
              )}>
                {action.replace('_', ' ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Edge</p>
              <p className={cn('text-2xl font-bold', edgePct > 0 ? 'text-success' : 'text-warning')}>
                {Math.abs(edgePct).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Price Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Price Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded p-3">
                <p className="text-xs text-muted-foreground flex items-center">
                  Market Price <InfoTooltip text={tips.marketPrice} />
                </p>
                <p className="text-xl font-bold">${marketPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{(marketPrice * 100).toFixed(0)}% implied</p>
              </div>
              <div className="bg-muted/30 rounded p-3">
                <p className="text-xs text-muted-foreground flex items-center">
                  AI Target <InfoTooltip text={tips.targetPrice} />
                </p>
                <p className="text-xl font-bold text-primary">${targetPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{(targetPrice * 100).toFixed(0)}% fair value</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>
            <div className="bg-muted/30 rounded p-4">
              {aiReasoning ? (
                <p className="text-foreground">{aiReasoning}</p>
              ) : (
                <p className="text-muted-foreground italic">AI analysis not available.</p>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center">
                Confidence <InfoTooltip text={tips.confidence} />
              </span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${confidence * 100}%` }} />
              </div>
              <span className="text-sm">{(confidence * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* News Sources */}
          {newsArticles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">📰 News Sources</h3>
              <div className="space-y-2">
                {newsArticles.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-muted/30 hover:bg-muted/50 rounded p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{article.title}</p>
                        {article.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="bg-muted px-2 py-0.5 rounded">{article.source_name || article.source}</span>
                          {article.published && (
                            <span>{new Date(article.published).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
            <div className="bg-muted/30 rounded p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className={cn('px-3 py-1 rounded font-bold bg-muted', getRiskColor(riskLevel))}>
                  {riskLevel.toUpperCase()}
                </span>
              </div>
              <p className="text-sm">{getRiskExplanation(riskLevel)}</p>
              {riskFactors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Risk Factors:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {riskFactors.map((factor, i) => (
                      <li key={i}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Position Sizing */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Position Sizing</h3>
            <div className="bg-muted/30 rounded p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Kelly Fraction <InfoTooltip text={tips.kelly} />
                  </p>
                  <p className="text-xl font-bold">{(kelly * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Expected Return <InfoTooltip text={tips.expectedReturn} />
                  </p>
                  <p className="text-xl font-bold text-success">{expectedReturn}%</p>
                </div>
              </div>
              <p className="text-xs text-warning">
                Using {riskLevel === 'extreme' ? '1/4' : riskLevel === 'high' ? '1/2' : 'Half'} Kelly for safety
              </p>
            </div>
          </div>

          {/* Monte Carlo */}
          {simulation && Object.keys(simulation).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Monte Carlo Algorithm</h3>
              <div className="bg-muted/30 rounded p-4 text-sm">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Model Type</p>
                    <p className="font-medium">{simulation.model || 'Jump-Diffusion'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Iterations</p>
                    <p className="font-medium">{(simulation.iterations || 5000).toLocaleString()} paths</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      Win Prob <InfoTooltip text={tips.winProb} />
                    </p>
                    <p className="font-medium">{((simulation.win_probability || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      Expected Value <InfoTooltip text={tips.expectedValue} />
                    </p>
                    <p className={cn('font-medium', (simulation.expected_value || 0) > 0 ? 'text-success' : 'text-destructive')}>
                      {(simulation.expected_value || 0) > 0 ? '+' : ''}{((simulation.expected_value || 0) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-muted-foreground mb-2">Risk Metrics:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-xs text-muted-foreground flex items-center">
                        VaR 95% <InfoTooltip text={tips.var95} />
                      </p>
                      <p className="font-medium">${(simulation.var_95 || 0).toFixed(3)}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-xs text-muted-foreground flex items-center">
                        CVaR 95% <InfoTooltip text={tips.cvar95} />
                      </p>
                      <p className="font-medium">${(simulation.cvar_95 || 0).toFixed(3)}</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-xs text-muted-foreground flex items-center">
                        Max DD <InfoTooltip text={tips.maxDrawdown} />
                      </p>
                      <p className="text-destructive font-medium">{((simulation.max_drawdown || 0) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 p-6 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {action !== 'AVOID' && onExecute && (
            <Button className="bg-success hover:bg-success/90" onClick={() => onExecute(recommendation)}>
              Execute Trade
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
