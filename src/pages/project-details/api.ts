import { apiClient } from "@/shared/api";
import type { ProjectDetails } from "@/entities/project/model/types";

export const fetchProject = async (projectId: string): Promise<ProjectDetails> => {
  const { data } = await apiClient.get(`/projects/${projectId}/`);
  return data;
};