import { apiClient } from "@/shared/api";

export async function deleteAnswer(answerId: string): Promise<void> {
  await apiClient.delete(`/qna/answers/${answerId}/`);
}
