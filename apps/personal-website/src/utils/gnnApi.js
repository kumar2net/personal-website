const DEV_FALLBACK_URL = 'http://localhost:8000';
const PROD_FALLBACK_URL = 'https://your-gnn-backend.netlify.app';

export const GNN_API_BASE_URL =
  (import.meta.env?.VITE_GNN_API_BASE_URL || '').trim() ||
  (import.meta.env?.DEV ? DEV_FALLBACK_URL : PROD_FALLBACK_URL);
