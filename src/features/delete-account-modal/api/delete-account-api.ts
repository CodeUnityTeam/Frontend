import { apiClient } from "@/shared/api";

type DeleteAccountResponse = {
  detail: string
}
export async function deleteAccountApi(): Promise<DeleteAccountResponse> {
  const {data} = await apiClient.delete("/user/profile/me/");
  return data
}