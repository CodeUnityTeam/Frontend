import { type GetProjectsParams } from "@/entities/project";

export function useProjectStatus(tab: string, isEmployer: boolean): GetProjectsParams["status"] {
  if (tab === "my-projects" && isEmployer) {
    return ["draft", "published", "recruiting_closed"];
  }

  if (tab === "favorites") {
    return ["published", "recruiting_closed"];
  }

  return ["published"];
}