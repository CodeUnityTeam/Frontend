import type { UserDetailsDto } from "@/entities/auth/model/types";
import { apiClient } from "@/shared/api";
import { clearTokens, getRefreshToken, setTokens } from "@/shared/lib/auth";

export type RegistrationRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type RegistrationResponse = {
  detail?: string;
};

export type VerifyEmailRequest = {
  key: string;
};

export type ApiRequestError = Error & {
  status?: number;
  data?: unknown;
};

export type RefreshResponse = {
  access: string;
  refresh?: string;
};

export type SocialAuthResponse = {
  access: string;
  refresh: string;
  user: UserDetailsDto; 
  access_expiration: string;
  refresh_expiration: string;
};

export async function registerUser(
  payload: RegistrationRequest,
): Promise<RegistrationResponse> {
  const { data } = await apiClient.post<RegistrationResponse>(
    "/user/auth/registration/",
    payload,
  );

  return data;
}

export async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    "/user/auth/registration/verify-email/",
    payload,
  );

  return data;
}

export async function getProviderUrl(provider: string): Promise<string | null> {
  const { data } = await apiClient.get<{
    authorization_url?: string;
  }>(`/user/auth/${provider}/url/`);
 
  return (
    (data && (data.authorization_url)) || null
  );
}

export async function getYandexAuthUrl(): Promise<string> {
  const { data } = await apiClient.get<{ authorization_url: string }>(
    "/user/auth/yandex/url/"
  );
  return data.authorization_url;
}

export async function getMailRuAuthUrl(): Promise<string> {
  const { data } = await apiClient.get<{ authorization_url: string }>(
    "/user/auth/mailru/url/"
  );
  return data.authorization_url;
}

export async function yandexAuth(code: string, state?: string): Promise<SocialAuthResponse> {
  const { data } = await apiClient.post<SocialAuthResponse>(
    "/user/auth/yandex/",
    { code, state }
  );
  return data;
}

export async function mailRuAuth(code: string, state?: string): Promise<SocialAuthResponse> {
  const { data } = await apiClient.post<SocialAuthResponse>(
    "/user/auth/mailru/",
    { code, state }
  );
  return data;
}

export async function logout(): Promise<void> {
  try {
    const refresh = getRefreshToken();
    if (refresh) {
      await apiClient.post("/auth/logout/", { refresh });
    } else {
      await apiClient.post("/auth/logout/");
    }
  } finally {
    clearTokens();
  }
}

export async function refreshToken(): Promise<{ access: string }> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const { data } = await apiClient.post<RefreshResponse>(
    "/user/auth/token/refresh/",
    { refresh }
  );

  if (data.refresh) {
    setTokens({
      access: data.access,
      refresh: data.refresh,
    });
  }

  return { access: data.access };
}

export default {
  registerUser,
  verifyEmail,
  getProviderUrl,
  getYandexAuthUrl,
  getMailRuAuthUrl,
  yandexAuth,
  mailRuAuth,
  logout,
  refreshToken,
};