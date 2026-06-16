import { apiClient } from "@/shared/api";
export async function deleteAccountApi() {
  await apiClient.delete('/user/profile/me')
}