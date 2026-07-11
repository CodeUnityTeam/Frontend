import { apiClient } from "@/shared/api";

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

export default {
  registerUser,
  verifyEmail,
  getProviderUrl,
};
