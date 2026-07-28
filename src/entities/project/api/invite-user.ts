import { apiClient } from "@/shared/api";

export async function inviteUser(
  projectId: string,
  userId: string,
): Promise<void> {
  await apiClient.post(`/projects/${projectId}/invite/${userId}/`);
}
