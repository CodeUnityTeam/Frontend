import { apiClient } from "@/shared/api";

export type ProjectStatus =
  | "draft"
  | "published"
  | "recruiting_closed"
  | "archived"
  | "blocked";

export type CreateProjectDto = {
  title: string;
  short_desc: string;
  full_desc?: string;
  location?: string;
  start_date: string;
  end_date: string;
  status_project?: ProjectStatus;
  skills: { skill_id: string }[];
  specializations: { spec_id: string }[];
  project_format: string[];
};

export async function createProject(data: CreateProjectDto): Promise<unknown> {
  const { data: res } = await apiClient.post("/projects/", data);
  return res;
}
