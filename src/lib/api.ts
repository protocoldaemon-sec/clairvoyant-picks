/**
 * REST API client for Clairvoyance backend
 */
import { API_URL } from './config';

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  connect: (walletAddress: string) =>
    apiRequest<{ nonce: string; message: string }>('/auth/connect', {
      method: 'POST',
      body: { wallet_address: walletAddress },
    }),
  
  verify: (walletAddress: string, signature: string, message: string) =>
    apiRequest<{ access_token: string; user: unknown }>('/auth/verify', {
      method: 'POST',
      body: { wallet_address: walletAddress, signature, message },
    }),
  
  getUser: (token: string) =>
    apiRequest<unknown>('/auth/user', { token }),
  
  acceptFees: (token: string, accepted: boolean) =>
    apiRequest<unknown>('/auth/accept-fees', {
      method: 'POST',
      body: { accepted },
      token,
    }),
};

// Markets API
export const marketsApi = {
  list: (limit = 50) =>
    apiRequest<unknown[]>(`/markets?limit=${limit}`),
  
  get: (ticker: string) =>
    apiRequest<unknown>(`/markets/${ticker}`),
  
  getVolatility: (ticker: string) =>
    apiRequest<unknown>(`/markets/${ticker}/volatility`),
};

// Recommendations API
export const recommendationsApi = {
  list: (minEdge = 0, limit = 20, sortBy = 'score', riskLevel?: string) => {
    let url = `/recommendations?min_edge=${minEdge}&limit=${limit}&sort_by=${sortBy}`;
    if (riskLevel) url += `&risk_level=${riskLevel}`;
    return apiRequest<unknown[]>(url);
  },
  
  getTop: (limit = 3) =>
    apiRequest<unknown[]>(`/recommendations/top?limit=${limit}`),
  
  get: (ticker: string) =>
    apiRequest<unknown>(`/recommendations/${ticker}`),
};

// Trades API
export const tradesApi = {
  execute: (token: string, trade: { ticker: string; action: string; size: number; price: number; balance_type: string }) =>
    apiRequest<{ new_balance?: number }>('/trades/execute', {
      method: 'POST',
      body: trade,
      token,
    }),
  
  getHistory: (token: string, limit = 50, balanceType?: string) => {
    let url = `/trades/history?limit=${limit}`;
    if (balanceType) url += `&balance_type=${balanceType}`;
    return apiRequest<unknown[]>(url, { token });
  },
  
  get: (token: string, tradeId: string) =>
    apiRequest<unknown>(`/trades/${tradeId}`, { token }),
};

// Portfolio API
export const portfolioApi = {
  get: (token: string) =>
    apiRequest<unknown>('/portfolio', { token }),
  
  getStats: (token: string) =>
    apiRequest<unknown>('/portfolio/stats', { token }),
  
  getHistory: (token: string, days = 30) =>
    apiRequest<unknown>(`/portfolio/history?days=${days}`, { token }),
};

// Dashboard API
export const dashboardApi = {
  get: () =>
    apiRequest<unknown>('/dashboard'),
  
  getPipelineStatus: () =>
    apiRequest<unknown>('/dashboard/pipeline/status'),
  
  getPipelineHistory: (limit = 10) =>
    apiRequest<unknown>(`/dashboard/pipeline/history?limit=${limit}`),
};

// Leaderboard API
export const leaderboardApi = {
  get: (limit = 20) =>
    apiRequest<unknown>(`/leaderboard?limit=${limit}`),
  
  getMyRank: (token: string) =>
    apiRequest<unknown>('/leaderboard/me', { token }),
};

// Crypto API
export const cryptoApi = {
  getPrices: () =>
    apiRequest<unknown[]>('/crypto/prices'),
  
  getPrice: (symbol: string) =>
    apiRequest<{ price: number; change_24h_pct: number }>(`/crypto/prices/${symbol}`),
  
  getRecommendations: (limit = 20, action?: string, minConfidence?: number) => {
    let url = `/crypto/recommendations?limit=${limit}`;
    if (action) url += `&action=${action}`;
    if (minConfidence) url += `&min_confidence=${minConfidence}`;
    return apiRequest<unknown[]>(url);
  },
  
  getPositionsSummary: (token: string) =>
    apiRequest<unknown>('/crypto/positions/summary', { token }),
  
  analyze: () =>
    apiRequest<unknown>('/crypto/analyze', { method: 'POST' }),
};

// Crypto Positions API
export const cryptoPositionsApi = {
  create: (token: string, position: {
    symbol: string;
    name: string;
    side: 'BUY' | 'SELL';
    entry_price: number;
    quantity: number;
    stop_loss: number;
    take_profit: number;
    balance_type: string;
    notes?: string;
  }) =>
    apiRequest<unknown>('/crypto/positions', {
      method: 'POST',
      body: position,
      token,
    }),
  
  list: (token: string, status?: string) => {
    let url = '/crypto/positions';
    if (status) url += `?status=${status}`;
    return apiRequest<unknown[]>(url, { token });
  },
  
  sell: (token: string, positionId: string) =>
    apiRequest<unknown>(`/crypto/positions/${positionId}/sell`, {
      method: 'PUT',
      token,
    }),
  
  close: (token: string, positionId: string) =>
    apiRequest<unknown>(`/crypto/positions/${positionId}/close`, {
      method: 'PUT',
      token,
    }),
  
  delete: (token: string, positionId: string) =>
    apiRequest<unknown>(`/crypto/positions/${positionId}`, {
      method: 'DELETE',
      token,
    }),
  
  getSummary: (token: string) =>
    apiRequest<unknown>('/crypto/positions/summary', { token }),
};
