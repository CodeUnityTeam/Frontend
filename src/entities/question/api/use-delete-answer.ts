import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAnswer } from "./delete-answer";
import { QUESTION_DETAILS_QUERY_KEY } from "./question-details-query-key";
import { QUESTIONS_QUERY_KEY } from "./use-questions";
import { removeQuestionDetailAnswer } from "./question-answer-cache";
import type { QuestionDetailDto } from "./get-question";

interface DeleteAnswerMutationVars {
  answerId: string;
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId }: DeleteAnswerMutationVars) =>
      deleteAnswer(answerId),

    onMutate: async ({ answerId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [QUESTION_DETAILS_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [QUESTIONS_QUERY_KEY] }),
      ]);

      const prevDetails = queryClient.getQueriesData<QuestionDetailDto>({
        queryKey: [QUESTION_DETAILS_QUERY_KEY],
      });

      queryClient.setQueriesData<QuestionDetailDto>(
        { queryKey: [QUESTION_DETAILS_QUERY_KEY] },
        (detail) => removeQuestionDetailAnswer(detail, answerId),
      );

      return { prevDetails };
    },

    onError: (_error, _vars, context) => {
      context?.prevDetails.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );

      toast.error("Не удалось удалить ответ. Попробуйте ещё раз.");
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUESTION_DETAILS_QUERY_KEY],
      });
      void queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
}
