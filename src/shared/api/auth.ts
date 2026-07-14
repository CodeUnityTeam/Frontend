import { apiClient } from "@/shared/api";
import { clearTokens, getRefreshToken } from "@/shared/lib/auth";

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

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout/");
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

  return { access: data.access };
}

export default {
  registerUser,
  verifyEmail,
  getProviderUrl,
  logout,
  refreshToken,
};