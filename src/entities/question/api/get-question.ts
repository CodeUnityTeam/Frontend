import { apiClient } from "@/shared/api";

export type QuestionAnswerDto = {
  answer_id: string;
  parent_answer_id: string | null;
  content: string;
  author_name: string;
  author_rating: number;
  created_at: string;
  likes_count: number;
  images: string[];
};

export type QuestionDetailDto = {
  question_id: string;
  title: string;
  description: string;
  tags: string[];
  author_name: string;
  author_rating: number;
  created_at: string;
  likes_count: number;
  images: string[];
  answers: QuestionAnswerDto[];
};

export type QuestionApiDto = QuestionDetailDto;

export async function getQuestion(id: string): Promise<QuestionDetailDto> {
  const { data } = await apiClient.get<QuestionDetailDto>(`/qna/questions/${id}/`);
  return data;
}
