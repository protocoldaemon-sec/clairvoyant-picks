import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { tradesApi } from '@/lib/api';

interface Recommendation {
  ticker: string;
  title?: string;
  market_price?: number;
  action?: string;
  kelly_criterion?: number;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
}

export default function TradeModal({ isOpen, onClose, recommendation }: TradeModalProps) {
  const { user, token, refreshUser } = useAuth();

  const [size, setSize] = useState(10);
  const [balanceType, setBalanceType] = useState<'simulation' | 'real'>('simulation');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!recommendation) return null;

  const price = recommendation.market_price || 0;
  const totalCost = size * price;
  const fees = totalCost * 0.035;
  const totalWithFees = totalCost + fees;

  const simulationBalance = user?.balance?.simulation ?? 10000;
  const realBalance = user?.balance?.real ?? 0;
  const currentBalance = balanceType === 'simulation' ? simulationBalance : realBalance;
  const insufficientBalance = totalWithFees > currentBalance;

  const sizePresets = [10, 25, 50, 100];

  const handleExecute = async () => {
    if (!token) return;

    if (balanceType === 'real') {
      setError('Real trading is not available yet');
      return;
    }

    if (insufficientBalance) {
      setError('Insufficient balance');
      return;
    }

    setIsExecuting(true);
    setError('');

    try {
      await tradesApi.execute(token, {
        ticker: recommendation.ticker,
        action: recommendation.action || 'BUY_YES',
        size,
        price,
        balance_type: balanceType,
      });

      // Reload user to get updated balance
      await refreshUser();

      setSuccess(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || 'Trade execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setSize(10);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trade Executed!</h3>
            <p className="text-muted-foreground">Your order has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Trade</DialogTitle>
              <p className="text-sm text-muted-foreground">{recommendation.ticker}</p>
            </DialogHeader>

            <div className="space-y-4">
              {/* Balance Type Selection */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Balance Type</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBalanceType('simulation')}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-lg border-2 transition-colors text-left',
                      balanceType === 'simulation'
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/50'
                    )}
                  >
                    <p className="text-sm font-medium">Simulation</p>
                    <p className="text-xs text-muted-foreground">${simulationBalance.toLocaleString()}</p>
                  </button>
                  <button
                    disabled
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-border bg-muted/30 opacity-50 cursor-not-allowed text-left"
                  >
                    <p className="text-sm font-medium text-muted-foreground">Real</p>
                    <p className="text-xs text-muted-foreground">${realBalance.toLocaleString()}</p>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Action</p>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    recommendation.action === 'BUY_YES' ? 'text-success' : 'text-destructive'
                  )}
                >
                  {recommendation.action === 'BUY_YES' ? 'BUY YES' : 'SELL NO'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Size (contracts)</p>
                <div className="flex gap-2 mb-2">
                  {sizePresets.map((preset) => (
                    <Button
                      key={preset}
                      variant={size === preset ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => setSize(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value) || 0)}
                  min={1}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per contract</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee (3.5%)</span>
                  <span>${fees.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalWithFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Balance</span>
                  <span className={insufficientBalance ? 'text-destructive' : 'text-success'}>
                    ${currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              {insufficientBalance && (
                <p className="text-warning text-sm">Insufficient balance for this trade</p>
              )}

              <Button
                onClick={handleExecute}
                disabled={isExecuting || size < 1 || insufficientBalance}
                className="w-full bg-success hover:bg-success/90"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Execute Trade'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
