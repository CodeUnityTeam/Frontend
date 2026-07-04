import { apiClient } from "@/shared/api";

export type CreateQuestionAnswerRequest = {
  content: string;
  parent_answer?: string | null;
};

export type CreateQuestionAnswerResponse = {
  answer_id: string;
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
