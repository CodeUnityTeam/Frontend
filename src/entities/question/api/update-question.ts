import { apiClient } from "@/shared/api";

export type UpdateQuestionRequest = {
  title: string;
  description: string;
  tags: string[];
};

export async function updateQuestion(
  id: string,
  payload: UpdateQuestionRequest,
): Promise<unknown> {
  const { data } = await apiClient.patch(`/qna/questions/${id}/`, payload);
  return data;
}
