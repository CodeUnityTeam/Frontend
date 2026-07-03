import { useInfiniteQuery } from "@tanstack/react-query";

import {
  DEFAULT_QUESTIONS_PAGE_SIZE,
  getQuestions,
  normalizeQuestionSearch,
} from "./get-questions";
import type { GetQuestionsParams } from "@/entities/question/model/types";

export const QUESTIONS_QUERY_KEY = "entities/question/list" as const;

export function useQuestions(params: Omit<GetQuestionsParams, "offset"> = {}) {
  const pageSize = params.limit ?? DEFAULT_QUESTIONS_PAGE_SIZE;
  const search = normalizeQuestionSearch(params.search);
  const queryParams = {
    ...params,
    limit: pageSize,
    search,
  };

  return useInfiniteQuery({
    queryKey: [QUESTIONS_QUERY_KEY, queryParams],
    queryFn: ({ pageParam }) =>
      getQuestions({
        ...queryParams,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * pageSize : undefined,
  });
}
