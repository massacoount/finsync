import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import axiosRetry, { type IAxiosRetryConfig } from "axios-retry";
import { apiConfig } from "@/config/api";
import type { RetryConfig } from "@/types/api";

/**
 * Retrieves the access token from storage.
 */
const getAccessToken = (): string | null =>
  localStorage.getItem("access_token");

/**
 * Retrieves the refresh token from storage.
 */
const getRefreshToken = (): string | null =>
  localStorage.getItem("refresh_token");

/**
 * Creates an Axios instance with retry capabilities and interceptors.
 * @param retryConfig Optional retry configuration.
 * @returns Configured Axios instance.
 */
const httpClientImpl = (retryConfig?: Partial<RetryConfig>): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: retryConfig?.timeout ?? apiConfig.defaultRetry.timeout,
  });

  // Configure Axios retry options
  const retryOptions: IAxiosRetryConfig = {
    retries: retryConfig?.retries ?? apiConfig.defaultRetry.retries,
    retryDelay: (retryCount: number) =>
      retryCount *
      (retryConfig?.retryDelay ?? apiConfig.defaultRetry.retryDelay),
    retryCondition: (error: AxiosError) =>
      retryConfig?.retryCondition?.(error) ??
      (axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response?.status !== undefined && error.response.status >= 500)),
    onRetry: (
      retryCount: number,
      error: AxiosError,
      requestConfig: AxiosRequestConfig
    ) => {
      console.warn(
        `[Retry] Attempt ${retryCount} for ${requestConfig.url}: ${error.message}`
      );
    },
  };

  axiosRetry(instance, retryOptions);

  /**
   * Request Interceptor: Attach Authorization token.
   */
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response Interceptor: Handle token expiration and refresh.
   */
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${apiConfig.baseUrl}/auth/refresh`,
              { token: refreshToken }
            );
            localStorage.setItem("access_token", data.token);
            error.config.headers.Authorization = `Bearer ${data.token}`;
            return instance(error.config); // Retry the original request
          } catch (refreshError) {
            console.error("[Auth] Token refresh failed", refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Default HTTP client with global configurations.
 */
export const httpClient = httpClientImpl();

/**
 * Factory function to create a custom Axios instance.
 */
export const createCustomHttpClient = httpClientImpl;
