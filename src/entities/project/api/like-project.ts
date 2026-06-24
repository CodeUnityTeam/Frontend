import { apiClient } from "@/shared/api";
import type { ProjectLikeResponse } from "@/entities/project/model/types";

interface ProjectLikeResponseDto {
  liked: boolean;
  likes_count: number;
}

export async function likeProject(
  projectId: string,
): Promise<ProjectLikeResponse> {
  const { data } = await apiClient.post<ProjectLikeResponseDto>(
    `/projects/${projectId}/like/`,
  );

  return {
    liked: data.liked,
    likesCount: data.likes_count,
  };
}
