import { apiClient } from "@/shared/api";
import type { ProjectDetails } from "@/entities/project/model/types";

export async function getProject(projectId: string): Promise<ProjectDetails> {
  const { data } = await apiClient.get<ProjectDetails>(
    `/projects/${projectId}/`,
  );
  return data;
}
