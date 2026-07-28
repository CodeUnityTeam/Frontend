import { apiClient } from "@/shared/api";

export type CreateQuestionAnswerRequest = {
  content: string;
  parent_answer?: string | null;
  images?: QuestionAnswerImage[];
};

export type CreateQuestionAnswerResponse = {
  answer_id: string;
};

export type QuestionAnswerImage = {
  image_url: string;
  original_name: string;
  file_size: number;
  mime_type: string;
};

export async function createQuestionAnswer(
  questionId: string,
  payload: CreateQuestionAnswerRequest,
): Promise<CreateQuestionAnswerResponse> {
  const { data } = await apiClient.post<CreateQuestionAnswerResponse>(
    `/qna/questions/${questionId}/answers/`,
    payload,
  );

  return data;
}
