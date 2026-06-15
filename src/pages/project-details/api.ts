import { apiClient } from "@/shared/api";
import type { Project } from "../../entities/project/model/types";
import { mockProject } from "@/entities/project/model/mock-projects";

const USE_MOCKS = true;

export const fetchProject = async (
  projectId: string,
): Promise<Project> => {
  if (USE_MOCKS) {
    return Promise.resolve(mockProject);
  }

  const { data } = await apiClient.get(`/projects/${projectId}/`);

  return data;
};