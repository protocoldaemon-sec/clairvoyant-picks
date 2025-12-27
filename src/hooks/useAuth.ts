import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { authApi } from '@/lib/api';
import bs58 from 'bs58';

interface UserBalance {
  simulation: number;
  real: number;
}

interface UserStats {
  total_trades: number;
  win_rate: number;
  total_profit: number;
  simulation_profit: number;
  real_profit: number;
}

interface User {
  wallet_address: string;
  created_at: string;
  fee_accepted: boolean;
  balance: UserBalance;
  stats: UserStats;
}

export function useAuth() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token && !!user;

  // Load user from token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async (authToken: string) => {
    try {
      const userData = await authApi.getUser(authToken) as User;
      setUser(userData);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload user data (for balance updates after trades)
  const reloadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const userData = await authApi.getUser(savedToken) as User;
        setUser(userData);
      } catch {
        // Ignore errors on reload
      }
    }
  }, []);

  const login = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError('Wallet not connected');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = publicKey.toBase58();
      
      // Get nonce from server
      const { message } = await authApi.connect(walletAddress);
      
      // Sign message
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = bs58.encode(signatureBytes);
      
      // Verify signature
      const { access_token, user: userData } = await authApi.verify(walletAddress, signature, message);
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData as User);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signMessage]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    disconnect();
  }, [disconnect]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    reloadUser,
    connected,
  };
}
