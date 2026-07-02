import { useQuery } from "@tanstack/react-query";

import { getQuestions, type GetQuestionsParams } from "./get-questions";

export const QUESTIONS_QUERY_KEY = "questions" as const;

export function useQuestions(params: GetQuestionsParams = {}) {
  const normalizedSearch = params.search?.trim();
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;

  return useQuery({
    queryKey: [
      QUESTIONS_QUERY_KEY,
      params.filter ?? "all",
      normalizedSearch ?? "",
      params.tags?.join(",") ?? "",
      limit,
      offset,
    ],
    queryFn: () =>
      getQuestions({
        ...params,
        search: normalizedSearch,
        limit,
        offset,
      }),
  });
}
