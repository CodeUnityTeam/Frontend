import { apiClient } from "@/shared/api";

export async function respondToProject(projectId: string): Promise<void> {
  await apiClient.post(`/projects/${projectId}/responses/`);
}
