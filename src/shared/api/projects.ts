import { apiClient } from "./api-client";

export type ApplyToProjectResponse = {
  response_id: string;
  project: string;
  user: string;
  initiator_type: "applicant";
  status_resp: "pending";
};

// Откликнуться на проект
export async function applyToProject(projectId: string): Promise<ApplyToProjectResponse> {
  const { data } = await apiClient.post<ApplyToProjectResponse>(
    `/projects/${projectId}/responses/`
  );
  return data;
}