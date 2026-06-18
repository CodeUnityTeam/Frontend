import { apiClient } from "@/shared/api";

type ChangeEmailResponse = {
  detail: string;
};
export async function changeEmailApi(email: string): Promise<ChangeEmailResponse> {
  const {data} = await apiClient.post("user/profile/email-change/", {
    new_email: email,
  });
  return data
}