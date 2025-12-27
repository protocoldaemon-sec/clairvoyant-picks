import { useEffect, useCallback, createContext, useContext, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { authApi } from '@/lib/api';
import bs58 from 'bs58';

interface UserBalance {
  simulation: number;
  real: number;
}

interface User {
  wallet_address: string;
  created_at: string;
  fee_accepted: boolean;
  balance?: UserBalance;
  stats?: {
    total_trades: number;
    win_rate: number;
    total_profit: number;
    simulation_profit: number;
    real_profit: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasTriedLogin, setHasTriedLogin] = useState(false);

  const isAuthenticated = !!token && !!user;

  // Load existing token on mount
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
      const userData = (await authApi.getUser(authToken)) as User;
      setUser(userData);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async () => {
    if (!publicKey || !signMessage) {
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
    setHasTriedLogin(false);
    disconnect();
  }, [disconnect]);

  const refreshUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return;
    
    try {
      const userData = (await authApi.getUser(savedToken)) as User;
      console.log('refreshUser response:', userData);
      setUser(userData);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  }, []);

  // Auto-login when wallet connects
  useEffect(() => {
    if (connected && publicKey && signMessage && !isAuthenticated && !hasTriedLogin && !isLoading) {
      setHasTriedLogin(true);
      login();
    }
  }, [connected, publicKey, signMessage, isAuthenticated, hasTriedLogin, isLoading, login]);

  // Reset hasTriedLogin when wallet disconnects - but don't auto-logout if we have a valid token
  useEffect(() => {
    if (!connected) {
      setHasTriedLogin(false);
      // Don't auto-logout - let user stay logged in with existing token
      // They can manually logout if needed
    }
  }, [connected]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, error, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
