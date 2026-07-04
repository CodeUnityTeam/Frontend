import { apiClient } from "@/shared/api";

import type {
  GetQuestionsParams,
  GetQuestionsResponse,
  QuestionDto,
  QuestionsPage,
} from "@/entities/question/model/types";

export const DEFAULT_QUESTIONS_PAGE_SIZE = 20;

export function normalizeQuestionSearch(search?: string): string | undefined {
  const normalized = search?.trim();
  return normalized ? normalized : undefined;
}

function mapQuestionItem(dto: QuestionDto): QuestionsPage["items"][number] {
  return {
    id: dto.question_id,
    title: dto.title,
    description: dto.description,
    tags: dto.tags,
    authorName: dto.author_name,
    authorRating: dto.author_rating,
    createdAt: dto.created_at,
    likesCount: dto.likes_count,
    answersCount: dto.answers_count,
  };
}

export async function getQuestions(
  params: GetQuestionsParams = {},
): Promise<QuestionsPage> {
  const {
    filter,
    limit = DEFAULT_QUESTIONS_PAGE_SIZE,
    offset = 0,
    search,
    tags,
  } = params;
  const normalizedSearch = normalizeQuestionSearch(search);
  const query: Record<string, string | number> = { limit, offset };

  if (filter) {
    query.filter = filter;
  }
  if (normalizedSearch) {
    query.search = normalizedSearch;
  }
  if (tags && tags.length > 0) {
    query.tags = tags.join(",");
  }

  const { data } = await apiClient.get<GetQuestionsResponse>(
    "/qna/questions/",
    {
      params: query,
    },
  );

  return {
    items: data.items.map(mapQuestionItem),
    count: data.total,
    hasMore: data.has_more,
  };
}
