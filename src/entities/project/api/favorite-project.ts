import { apiClient } from "@/shared/api";
import type { ProjectFavoriteResponse } from "@/entities/project/model/types";

interface ProjectFavoriteResponseDto {
  favorited: boolean;
}

export async function favoriteProject(
  projectId: string,
): Promise<ProjectFavoriteResponse> {
  const { data } = await apiClient.post<ProjectFavoriteResponseDto>(
    `/projects/${projectId}/favorite/`,
  );

  return {
    favorited: data.favorited,
  };
}
