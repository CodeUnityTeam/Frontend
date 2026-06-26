import { apiClient } from "@/shared/api";

type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
}
type ChangePasswordResponse = {
  detail: string
}
export async function changePasswordApi(
  request: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const { data } = await apiClient.post("user/auth/password/change/", request);
  return data;
}