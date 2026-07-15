import { apiClient } from "@/shared/api";
import type {
  GetProjectsParams,
  ProjectsPage,
} from "@/entities/project/model/types";
import {
  mapProject,
  type ProjectsResponseDto,
} from "@/entities/project/api/project-mapper";

export async function getProjects(
  params: GetProjectsParams = {},
): Promise<ProjectsPage> {
  const {
    page = 1,
    pageSize = 20,
    sortBy = "published_at",
    skillsId,
    formatId,
    specId,
    duration,
    favourites,
    myProject,
    search,
    loadMore,
    status
  } = params;

  let finalSortBy = sortBy;
  if (sortBy === "relevance" && !search?.trim()) {
    finalSortBy = "published_at";
  }

  const { data } = await apiClient.get<ProjectsResponseDto>("/projects/", {
    params: {
      page,
      limit: pageSize,
      ...(finalSortBy && { sort_by: finalSortBy }),
      ...(skillsId && skillsId?.length > 0 && { skills_id: skillsId.join(",") }),
      ...(formatId && formatId?.length > 0 && { format_id: formatId.join(",") }),
      ...(specId && specId?.length > 0 && { spec_id: specId.join(",") }),
      ...(duration?.operator && { duration_operator: duration.operator }),
      ...(duration?.min && { duration_min: duration.min }),
      ...(duration?.max && { duration_max: duration.max }),
      ...(favourites && { favourites }),
      ...(myProject && { my_project: "true" }),
      ...(search?.trim() && { search: search.trim() }),
      ...(loadMore !== undefined && { load_more: loadMore }),
      ...(status && status?.length > 0 && { status: status.join(",") }),
    },
  });

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
