import { apiClient } from "@/shared/api";

export async function deleteQuestion(id: string): Promise<void> {
  await apiClient.delete(`/qna/questions/${id}/`);
}
