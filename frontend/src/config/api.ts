import type { ApiConfig } from '@/types/api';

export const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL,
  defaultRetry: {
    retries: 3,
    retryDelay: 1000,
    timeout: 5000
  }
};