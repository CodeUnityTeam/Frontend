import { apiClient } from "@/shared/api";
import type { Project } from "@/entities/project/model/types";

export const fetchProject = async (projectId: string): Promise<Project> => {
  const { data } = await apiClient.get(`/projects/${projectId}/`);
  return data;
};