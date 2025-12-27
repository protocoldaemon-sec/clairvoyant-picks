import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const isPhantomInstalled = () => typeof window !== 'undefined' && !!(window as any).phantom?.solana;
const isSolflareInstalled = () => typeof window !== 'undefined' && !!(window as any).solflare;

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { select, wallets, connect, wallet } = useWallet();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-connect after wallet is selected
  useEffect(() => {
    if (wallet && isConnecting && !wallet.adapter.connected) {
      connect().catch((err) => {
        setError(err.message || 'Failed to connect wallet');
        setSelectedWallet(null);
        setIsConnecting(false);
      });
    }
  }, [wallet, isConnecting, connect]);

  useEffect(() => {
    if (isAuthenticated && isConnecting && !authLoading) {
      setIsConnecting(false);
      setSelectedWallet(null);
      onClose();
    }
  }, [isAuthenticated, isConnecting, authLoading, onClose]);

  const handleConnect = useCallback(async (walletName: string) => {
    setError('');
    setSelectedWallet(walletName);
    setIsConnecting(true);

    if (walletName === 'Phantom' && !isPhantomInstalled()) {
      window.open('https://phantom.app/', '_blank');
      setError('Please install Phantom wallet');
      setSelectedWallet(null);
      setIsConnecting(false);
      return;
    }
    if (walletName === 'Solflare' && !isSolflareInstalled()) {
      window.open('https://solflare.com/', '_blank');
      setError('Please install Solflare wallet');
      setSelectedWallet(null);
      setIsConnecting(false);
      return;
    }
    try {
      const targetWallet = wallets.find(w => w.adapter.name === walletName);
      if (targetWallet) {
        select(targetWallet.adapter.name);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to connect wallet');
      setSelectedWallet(null);
      setIsConnecting(false);
    }
  }, [wallets, select]);

  const walletOptions = [
    { name: 'Phantom', icon: '/logo-phantom.png', installed: isPhantomInstalled() },
    { name: 'Solflare', icon: '/logo-solflare.png', installed: isSolflareInstalled() },
  ];

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isConnecting && !authLoading) onClose();
      }}
    >
      <div
        className="bg-slate-800 rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.png" alt="Clairvoyance" className="h-8" />
          <button
            onClick={() => { if (!isConnecting && !authLoading) onClose(); }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Choose your preferred Solana wallet to connect
        </p>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              disabled={isConnecting || authLoading}
              className="w-full flex items-center gap-4 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={wallet.icon} alt={wallet.name} className="w-12 h-12 rounded-xl" />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{wallet.name}</div>
                <div className="text-slate-400 text-sm">
                  {wallet.installed ? 'Detected' : 'Not installed'}
                </div>
              </div>
              {(isConnecting || authLoading) && selectedWallet === wallet.name ? (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <p className="mt-6 text-center text-slate-500 text-xs">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
