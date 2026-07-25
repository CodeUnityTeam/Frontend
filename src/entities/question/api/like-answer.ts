import { apiClient } from "@/shared/api";

export type AnswerLikeResponse = {
  liked: boolean;
  likesCount: number;
};

type AnswerLikeResponseDto = {
  liked: boolean;
  likes_count: number;
};

export async function likeAnswer(answerId: string): Promise<AnswerLikeResponse> {
  const { data } = await apiClient.post<AnswerLikeResponseDto>(
    `/qna/answers/${answerId}/like/`,
  );

  return {
    liked: data.liked,
    likesCount: data.likes_count,
  };
}
