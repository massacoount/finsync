export interface RetryConfig {
  retries: number;
  retryDelay: number;
  timeout: number;
  retryCondition?: (error: unknown) => boolean;
}

export interface ApiConfig {
  baseUrl: string;
  defaultRetry: RetryConfig;
}
