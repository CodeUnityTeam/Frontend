import { apiClient } from "@/shared/api";
import type { CreateProjectDto, ProjectStatus } from "./create-project";

export type UpdateProjectDto = Partial<CreateProjectDto> & {
  status_project?: ProjectStatus;
};

export async function updateProject(
  id: string,
  data: UpdateProjectDto,
): Promise<unknown> {
  const { data: res } = await apiClient.patch(`/projects/${id}/`, data);
  return res;
}
