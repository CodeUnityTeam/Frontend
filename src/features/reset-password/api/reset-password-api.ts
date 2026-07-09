import { apiClient } from "@/shared/api";

type ResetPasswordConfirmData = {
  new_password: string;
  token: string;
  uid: string;
};

type ResetPasswordConfirmResponse = {
  detail: string;
};

export async function resetPasswordApi(email: string): Promise<void> {
  await apiClient.post("/user/auth/password/reset/", { email });
}

export async function resetPasswordConfirmApi(
  data: ResetPasswordConfirmData,
): Promise<ResetPasswordConfirmResponse> {
  const { data: response } = await apiClient.post<ResetPasswordConfirmResponse>(
    "/user/auth/password/reset/confirm/",
    data,
  );
  return response;
}