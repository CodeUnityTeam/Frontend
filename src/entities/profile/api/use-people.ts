import { useInfiniteQuery } from "@tanstack/react-query";

import { getPeople } from "@/entities/profile/api/get-people";
import type { GetPeopleParams } from "@/entities/profile/model/types";

const DEFAULT_LIMIT = 20;

export const PEOPLE_QUERY_KEY = "entities/profile/people" as const;

export function usePeople(params: Omit<GetPeopleParams, "page"> = {}) {
  const limit = params.limit ?? DEFAULT_LIMIT;

  return useInfiniteQuery({
    queryKey: [PEOPLE_QUERY_KEY, { ...params, limit }],
    queryFn: ({ pageParam }) =>
      getPeople({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}
