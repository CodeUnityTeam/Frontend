import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { likeAnswer } from "./like-answer";
import { QUESTION_DETAILS_QUERY_KEY } from "./question-details-query-key";
import { patchQuestionDetailAnswerLikes } from "./question-answer-cache";
import type { QuestionDetailDto } from "./get-question";
import { useAnswerLikesStore } from "@/shared/store/answer-likes-store";

interface LikeAnswerMutationVars {
  answerId: string;
  liked: boolean;
}

export function useLikeAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId }: LikeAnswerMutationVars) => likeAnswer(answerId),

    onMutate: async ({ answerId, liked }) => {
      await queryClient.cancelQueries({
        queryKey: [QUESTION_DETAILS_QUERY_KEY],
      });

      const prevDetails = queryClient.getQueriesData<QuestionDetailDto>({
        queryKey: [QUESTION_DETAILS_QUERY_KEY],
      });
      const previousLiked =
        useAnswerLikesStore.getState().likedAnswerIds[answerId] ?? false;

      useAnswerLikesStore.getState().setAnswerLiked(answerId, liked);

      queryClient.setQueriesData<QuestionDetailDto>(
        { queryKey: [QUESTION_DETAILS_QUERY_KEY] },
        (detail) => patchQuestionDetailAnswerLikes(detail, answerId, liked),
      );

      return { prevDetails, previousLiked };
    },

    onError: (_error, { answerId }, context) => {
      context?.prevDetails.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );

      useAnswerLikesStore.getState().setAnswerLiked(
        answerId,
        context?.previousLiked ?? false,
      );

      toast.error("Не удалось обновить лайк ответа. Попробуйте ещё раз.");
    },

    onSuccess: (data, { answerId }) => {
      useAnswerLikesStore.getState().setAnswerLiked(answerId, data.liked);

      queryClient.setQueriesData<QuestionDetailDto>(
        { queryKey: [QUESTION_DETAILS_QUERY_KEY] },
        (detail) =>
          patchQuestionDetailAnswerLikes(
            detail,
            answerId,
            data.liked,
            data.likesCount,
          ),
      );
    },
  });
}
