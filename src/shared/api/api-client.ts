import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
} from "@/shared/lib/auth";
import { toApiError } from "../api/api-error";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AUTH_URLS = ["/auth/login/", "/token/refresh/"];

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ access: string; refresh?: string }>(
        "/user/auth/token/refresh/",
        { refresh: getRefreshToken() },
        { baseURL: apiClient.defaults.baseURL },
      )
      .then(({ data }) => {
        if (data.refresh) {
          setTokens({ access: data.access, refresh: data.refresh });
        } else {
          setAccessToken(data.access);
        }

        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!(error instanceof AxiosError)) throw error;

  const config = error.config as RetriableConfig | undefined;
  const isAuthUrl = AUTH_URLS.some((url) => config?.url?.includes(url));

  if (
    config &&
    error.response?.status === 401 &&
    !config._retry &&
    !isAuthUrl &&
    getRefreshToken()
  ) {
    let access: string;

    try {
      access = await refreshAccessToken();
    } catch {
      clearTokens();
      throw toApiError(error);
    }

    config._retry = true;
    config.headers.Authorization = `Bearer ${access}`;

    return apiClient(config);
  }

  throw toApiError(error);
});
