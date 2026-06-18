import { apiClient } from "@/shared/api";

type ChangePasswordResponse = {
  detail: string
}
export async function changePasswordApi(
  newPassword: string,
): Promise<ChangePasswordResponse> {
  const {data} = await apiClient.post("user/auth/password/change/", {
    password: newPassword,
  });
  return data
}