import type { GetQuestionsParams } from "@/entities/question/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestions } from "@/entities/question/api/get-questions";

const PAGE_SIZE = 20;
export const QUESTIONS_QUERY_KEY = "entities/question/list" as const;

export function useQuestions(params: Omit<GetQuestionsParams, "offset" | "limit"> = {}) {
  return useInfiniteQuery({
    queryKey: [QUESTIONS_QUERY_KEY, params],
    queryFn: ({pageParam}) => getQuestions({...params, offset: pageParam, limit: PAGE_SIZE}),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length * PAGE_SIZE : undefined
  })
}