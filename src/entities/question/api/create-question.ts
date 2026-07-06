import { apiClient } from "@/shared/api";

export type CreateQuestionRequest = {
  title: string;
  description: string;
  tags: string[];
  is_anonymous?: boolean;
};

export async function createQuestion(
  payload: CreateQuestionRequest,
): Promise<unknown> {
  const { data } = await apiClient.post("/qna/questions/", payload);
  return data;
}
