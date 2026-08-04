import { type GetProjectsParams } from "@/entities/project";

export function useProjectStatus(
  tab: string, 
  isEmployer: boolean
): GetProjectsParams["status"] {
  if (tab === "my-projects" && isEmployer) {
    return undefined; // показываем все проекты
  }

  // Избранное — только опубликованные проекты
  if (tab === "favorites") {
    return "published";
  }

  // Каталог — только опубликованные
  return "published";
}