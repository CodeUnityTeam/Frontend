import { apiClient } from "@/shared/api";

export type QuestionListFilter = "popular" | "no_answers" | "my";

export type QuestionListItemDto = {
  question_id: string;
  title: string;
  description: string;
  tags: string[];
  author_name: string;
  author_rating: number;
  created_at: string;
  likes_count: number;
  answers_count: number;
};

export type QuestionsResponseDto = {
  items: QuestionListItemDto[];
  total: number;
  has_more: boolean;
};

export type GetQuestionsParams = {
  filter?: QuestionListFilter;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
};

const DEFAULT_LIMIT = 50;

export async function getQuestions(
  params: GetQuestionsParams = {},
): Promise<QuestionsResponseDto> {
  const searchParams = new URLSearchParams();
  const search = params.search?.trim();
  const limit = params.limit ?? DEFAULT_LIMIT;
  const offset = params.offset ?? 0;

  if (params.filter) {
    searchParams.set("filter", params.filter);
  }

  if (search) {
    searchParams.set("search", search);
  }

  if (params.tags?.length) {
    searchParams.set("tags", params.tags.join(","));
  }

  searchParams.set("limit", String(limit));
  searchParams.set("offset", String(offset));

  const query = searchParams.toString();
  const { data } = await apiClient.get<QuestionsResponseDto>(
    `/qna/questions/${query ? `?${query}` : ""}`,
  );

  return data;
}
