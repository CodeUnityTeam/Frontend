import { useInfiniteQuery } from "@tanstack/react-query";

import { getProjects } from "@/entities/project/api/get-projects";
import type { GetProjectsParams } from "@/entities/project/model/types";

const DEFAULT_PAGE_SIZE = 20;

export const PROJECTS_QUERY_KEY = "entities/project/list" as const;

export function useProjects(params: GetProjectsParams = {}) {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: [PROJECTS_QUERY_KEY, { ...params, pageSize }],
    queryFn: ({ pageParam }) =>
      getProjects({ 
        ...params,
        page: pageParam,
        pageSize,
        loadMore: pageParam > 1
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}
