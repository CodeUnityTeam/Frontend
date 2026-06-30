import type {
  GetQuestionsParams,
  GetQuestionsResponse,
  QuestionsPage,
} from "@/entities/question/model/types.ts";
import { apiClient } from "@/shared/api";

const PAGE_SIZE = 20;

export async function getQuestions(
  params: GetQuestionsParams,
): Promise<QuestionsPage> {
  const {filter, limit = PAGE_SIZE, offset = 0, search, tags} = params;
  const query: Record<string, string | number> = {limit, offset};

  if(filter) query.filter = filter;
  if(search) query.search = search;
  if(tags && tags.length > 0) query.tags = tags.join(",")

  const {data} = await apiClient.get<GetQuestionsResponse>('qna/questions/', {params:query});

  return {
    items: data.items.map((dto) => ({
      id: dto.question_id,
      title: dto.title,
      description: dto.description,
      tags: dto.tags,
      authorName: dto.author_name,
      authorRating: dto.author_rating,
      createdAt: dto.created_at,
      likesCount: dto.likes_count,
      answersCount: dto.answers_count,
    })),
    count: data.total,
    hasMore: data.has_more,
  };
}