import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/shared/lib/auth";
import { toApiError } from "../api/api-error";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

const AUTH_URLS = [
  "/auth/login/",
  "/auth/token/refresh/",
  "/auth/logout/",
];

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (
  error: unknown,
  accessToken?: string,
): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    promise.resolve(accessToken!);
  });

  failedQueue = [];
};

const logout = async () => {
  try {
    const refresh = getRefreshToken();

    if (refresh) {
      await apiClient.post("/auth/logout/", {
        refresh,
      });
    }
  } catch {
    // ignore
  } finally {
    clearTokens();
    window.dispatchEvent(new CustomEvent("open-login-modal"));
  }
};

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      throw error;
    }

    const originalRequest =
      error.config as RetryAxiosRequestConfig;

    const isAuthUrl = AUTH_URLS.some((url) =>
      originalRequest?.url?.includes(url),
    );

    if (
      error.response?.status !== 401 ||
      isAuthUrl ||
      originalRequest._retry
    ) {
      throw toApiError(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      await logout();
      throw toApiError(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization =
                `Bearer ${token}`;
            }

            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post(
        "/auth/token/refresh/",
        {
          refresh: refreshToken,
        },
      );

      const { access, refresh } = data;

      setTokens({
        access,
        refresh,
      });

      processQueue(null, access);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization =
          `Bearer ${access}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      await logout();

      throw toApiError(
        refreshError instanceof AxiosError
          ? refreshError
          : error,
      );
    } finally {
      isRefreshing = false;
    }
  },
);