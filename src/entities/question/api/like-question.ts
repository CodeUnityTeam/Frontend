import { apiClient } from "@/shared/api";

export type QuestionLikeResponse = {
  liked: boolean;
  likesCount: number;
};

type QuestionLikeResponseDto = {
  liked: boolean;
  likes_count: number;
};

export async function likeQuestion(
  questionId: string,
): Promise<QuestionLikeResponse> {
  const { data } = await apiClient.post<QuestionLikeResponseDto>(
    `/qna/questions/${questionId}/like/`,
  );

  return {
    liked: data.liked,
    likesCount: data.likes_count,
  };
}
