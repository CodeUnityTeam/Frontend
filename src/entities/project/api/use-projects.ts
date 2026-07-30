import { useInfiniteQuery } from "@tanstack/react-query";

import { getProjects } from "@/entities/project/api/get-projects";
import type { GetProjectsParams } from "@/entities/project/model/types";

type UseProjectsOptions = {
  enabled?: boolean;
};

const DEFAULT_PAGE_SIZE = 20;

export const PROJECTS_QUERY_KEY = "entities/project/list" as const;

export function useProjects(
  params: GetProjectsParams = {},
  options?: UseProjectsOptions,
) {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const queryKey = [
    PROJECTS_QUERY_KEY,
    {
      favourites: !!params.favourites,
      myProject: !!params.myProject,
      status: params.status,
      search: params.search ?? "",
      sortBy: params.sortBy ?? "published_at",
      formatId: params.formatId,
      specId: params.specId,
      skillsId: params.skillsId,
      duration: params.duration,
    },
  ];
  
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => 
      getProjects({
        ...params,
        page: pageParam,
        pageSize,
        loadMore: pageParam > 1,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: options?.enabled,
  });
}