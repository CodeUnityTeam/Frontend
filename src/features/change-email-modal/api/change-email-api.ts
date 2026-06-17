import { apiClient } from "@/shared/api";

export async function changeEmailApi(email: string):Promise<void> {
  await apiClient.post("user/profile/email-change/", {
    new_email: email,
  });
}