import { useInfiniteQuery } from "@tanstack/react-query";

import { getPeopleResponses } from "@/entities/profile/api/get-people-responses";

const DEFAULT_LIMIT = 20;

export const PEOPLE_RESPONSES_QUERY_KEY =
  "entities/profile/people-responses" as const;

export function usePeopleResponses(params: { limit?: number } = {}) {
  const limit = params.limit ?? DEFAULT_LIMIT;

  return useInfiniteQuery({
    queryKey: [PEOPLE_RESPONSES_QUERY_KEY, { limit }],
    queryFn: ({ pageParam }) =>
      getPeopleResponses({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}
