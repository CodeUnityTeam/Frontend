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
    authorAvatar: dto.author_avatar,
    createdAt: dto.created_at,
    likesCount: dto.likes_count,
    answersCount: dto.answers_count,
    isLikedByMe: dto.is_liked_by_me,
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

  const { data } = await apiClient.get<GetQuestionsResponse>(
    "/qna/questions/",
    {
      params: {
        limit,
        offset,
        ...(filter && { filter }),
        ...(normalizedSearch && { search: normalizedSearch }),
        ...(tags && tags?.length > 0 && { tags }),
      },
    },
  );

  return {
    items: data.items.map(mapQuestionItem),
    total: data.total,
    hasMore: data.has_more,
  };
}
