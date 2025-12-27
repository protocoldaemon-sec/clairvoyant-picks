// API Configuration
const isDev = import.meta.env.DEV;

// In development, use proxy (/api). In production, use env variable.
export const API_URL = isDev 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://clairvoyance-production.up.railway.app');

export const WS_URL = isDev
  ? '/ws'
  : (import.meta.env.VITE_WS_URL || 'wss://clairvoyance-production.up.railway.app');
