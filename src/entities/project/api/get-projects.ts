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
    sortBy,
    skillsId,
    formatId,
    specId,
    duration,
    favourites,
  } = params;

  const query: Record<string, string | number> = {
    page,
    page_size: pageSize,
  };

  if (sortBy) {
    query.sort_by = sortBy;
  }
  if (skillsId && skillsId.length > 0) {
    query.skills_id = skillsId.join(",");
  }
  if (formatId && formatId.length > 0) {
    query.format_id = formatId.join(",");
  }
  if (specId && specId.length > 0) {
    query.spec_id = specId.join(",");
  }
  if (duration) {
    query.duration_operator = duration.operator;
    if (duration.min != null) {
      query.duration_min = duration.min;
    }
    if (duration.max != null) {
      query.duration_max = duration.max;
    }
  }
  if (favourites) {
    query.favourites = "true";
  }

  const { data } = await apiClient.get<ProjectsResponseDto>("/projects/", {
    params: query,
  });

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
