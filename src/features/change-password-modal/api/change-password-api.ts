import { apiClient } from "@/shared/api";

export async function changePasswordApi(newPassword: string):Promise<void> {
  await apiClient.post("user/auth/password/change/", { new_password: newPassword });
}