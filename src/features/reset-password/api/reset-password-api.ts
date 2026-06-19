import { apiClient } from "@/shared/api";

export async function resetPasswordApi(email: string): Promise<void> {
   await apiClient.post("/user/auth/password/reset/", {email});
}