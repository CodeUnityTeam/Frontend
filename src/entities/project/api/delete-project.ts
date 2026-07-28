import { apiClient } from "@/shared/api";

export async function deleteProject(projectId: string): Promise<void> {
  await apiClient.delete(`/projects/${projectId}/`);
}
