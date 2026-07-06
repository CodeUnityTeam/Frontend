import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createQuestionAnswer } from "./create-question-answer";
import { getQuestionDetailsQueryKey } from "./question-details-query-key";
import { QUESTIONS_QUERY_KEY } from "./use-questions";

interface CreateQuestionAnswerMutationVars {
  questionId: string;
  content: string;
  parentAnswer?: string | null;
}

type CreateQuestionAnswerOptions = {
  onSuccess?: (
    data: Awaited<ReturnType<typeof createQuestionAnswer>>,
    variables: CreateQuestionAnswerMutationVars,
  ) => void;
};

export function useCreateQuestionAnswer(
  options: CreateQuestionAnswerOptions = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      content,
      parentAnswer,
    }: CreateQuestionAnswerMutationVars) =>
      createQuestionAnswer(questionId, {
        content,
        parent_answer: parentAnswer ?? null,
      }),

    onSuccess: (data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: getQuestionDetailsQueryKey(vars.questionId),
      });
      void queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
      options.onSuccess?.(data, vars);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
