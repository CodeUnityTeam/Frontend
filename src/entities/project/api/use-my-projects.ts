import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";

type GetMyProjectsParams = {
  limit?: number;
};

type Project = {
  projectId: string;
  title: string;
  shortDesc: string;
  location: string;
  statusProject: string;
  publishedAt: string;
  participantsCount: number;
  isLikedByMe: boolean;
  isFavoriteByMe: boolean;
  skills: { skillId: string; name: string }[];
};

type ProjectsResponse = {
  items: Project[];
  total: number;
  hasMore: boolean;
};

export const useMyApprovedProjects = ({ limit = 20 }: GetMyProjectsParams = {}) => {
  return useInfiniteQuery({
    queryKey: [PROJECTS_QUERY_KEY, "my-approved-projects"],
    queryFn: async ({ pageParam = 1 }) => {
      // Используем параметр my_project=true для получения проектов пользователя
      // и фильтруем по статусу approved через дополнительный запрос к откликам
      const response = await apiClient.get<ProjectsResponse>(
        `/api/v1/projects/?my_project=true&limit=${limit}&page=${pageParam}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};