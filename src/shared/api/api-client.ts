import axios, { AxiosError } from "axios";
import { clearTokens, getAccessToken } from "@/shared/lib/auth";
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      throw error;
    }

    const isAuthUrl = AUTH_URLS.some((url) =>
      error.config?.url?.includes(url),
    );

    if (error.response?.status === 401 && !isAuthUrl) {
      clearTokens();
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    }

    throw toApiError(error);
  },
);