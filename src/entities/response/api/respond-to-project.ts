import { applyToProject } from "@/shared/api/projects";

export async function respondToProject(projectId: string) {
  return applyToProject(projectId);
}