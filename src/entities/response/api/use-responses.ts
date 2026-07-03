import { useInfiniteQuery } from "@tanstack/react-query";

import { getResponses } from "@/entities/response/api/get-responses";
import type { GetResponsesParams } from "@/entities/response/model/types";

const DEFAULT_LIMIT = 20;

export const RESPONSES_QUERY_KEY = "entities/response/feed" as const;

export function useResponses(params: Omit<GetResponsesParams, "page"> = {}) {
  const limit = params.limit ?? DEFAULT_LIMIT;

  return useInfiniteQuery({
    queryKey: [RESPONSES_QUERY_KEY, { ...params, limit }],
    queryFn: ({ pageParam }) =>
      getResponses({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}
