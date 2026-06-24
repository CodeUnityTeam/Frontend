import { apiClient } from "@/shared/api";
import type {
  GetRecommendationsParams,
  ProjectsPage,
} from "@/entities/project/model/types";
import {
  mapProject,
  type ProjectsResponseDto,
} from "@/entities/project/api/project-mapper";

export async function getRecommendations(
  params: GetRecommendationsParams = {},
): Promise<ProjectsPage> {
  const { page = 1, limit = 20 } = params;

  const { data } = await apiClient.get<ProjectsResponseDto>(
    "/projects/recommendations/",
    { params: { page, limit } },
  );

  return {
    items: data.items.map(mapProject),
    total: data.total,
    hasMore: data.has_more,
  };
}
