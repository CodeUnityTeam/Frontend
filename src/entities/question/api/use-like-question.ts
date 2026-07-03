import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { likeQuestion } from "./like-question";
import { type QuestionDetailDto } from "./get-question";
import { QUESTIONS_QUERY_KEY } from "./use-questions";
import type {
  QuestionItem,
  QuestionsPage,
} from "@/entities/question/model/types";
import { useQuestionLikesStore } from "@/shared/store/question-likes-store";

const QUESTION_DETAILS_QUERY_KEY = "question-details" as const;

type QuestionsListData = QuestionsPage | InfiniteData<QuestionsPage>;

interface LikeQuestionMutationVars {
  questionId: string;
  liked: boolean;
}

function patchListLiked(
  questionId: string,
  liked: boolean,
  likesCount?: number,
) {
  return (
    data: QuestionsListData | undefined,
  ): QuestionsListData | undefined => {
    if (!data) {
      return data;
    }

    const patchPage = (page: QuestionsPage): QuestionsPage => ({
      ...page,
      items: page.items.map((item: QuestionItem) =>
        item.id === questionId
          ? {
              ...item,
              likesCount:
                likesCount ?? Math.max(0, item.likesCount + (liked ? 1 : -1)),
            }
          : item,
      ),
    });

    if ("pages" in data) {
      return { ...data, pages: data.pages.map(patchPage) };
    }

    return patchPage(data);
  };
}

function patchDetailLiked(
  questionId: string,
  liked: boolean,
  likesCount?: number,
) {
  return (detail: QuestionDetailDto | undefined): QuestionDetailDto | undefined =>
    !detail || detail.question_id !== questionId
      ? detail
      : {
          ...detail,
          likes_count:
            likesCount ?? Math.max(0, detail.likes_count + (liked ? 1 : -1)),
        };
}

export function useLikeQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId }: LikeQuestionMutationVars) =>
      likeQuestion(questionId),

    onMutate: async ({ questionId, liked }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: [QUESTIONS_QUERY_KEY] }),
        queryClient.cancelQueries({ queryKey: [QUESTION_DETAILS_QUERY_KEY] }),
      ]);

      const prevLists = queryClient.getQueriesData<QuestionsListData>({
        queryKey: [QUESTIONS_QUERY_KEY],
      });
      const prevDetails = queryClient.getQueriesData<QuestionDetailDto>({
        queryKey: [QUESTION_DETAILS_QUERY_KEY],
      });

      const previousLiked =
        useQuestionLikesStore.getState().likedQuestionIds[questionId] ?? false;

      useQuestionLikesStore.getState().setQuestionLiked(questionId, liked);

      queryClient.setQueriesData<QuestionsListData>(
        { queryKey: [QUESTIONS_QUERY_KEY] },
        patchListLiked(questionId, liked),
      );
      queryClient.setQueriesData<QuestionDetailDto>(
        { queryKey: [QUESTION_DETAILS_QUERY_KEY] },
        patchDetailLiked(questionId, liked),
      );

      return { prevLists, prevDetails, previousLiked };
    },

    onError: (_error, { questionId }, context) => {
      context?.prevLists.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      context?.prevDetails.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );

      useQuestionLikesStore.getState().setQuestionLiked(
        questionId,
        context?.previousLiked ?? false,
      );

      toast.error("Не удалось обновить лайк. Попробуйте ещё раз.");
    },

    onSuccess: (data, { questionId }) => {
      useQuestionLikesStore.getState().setQuestionLiked(questionId, data.liked);

      queryClient.setQueriesData<QuestionsListData>(
        { queryKey: [QUESTIONS_QUERY_KEY] },
        patchListLiked(questionId, data.liked, data.likesCount),
      );
      queryClient.setQueriesData<QuestionDetailDto>(
        { queryKey: [QUESTION_DETAILS_QUERY_KEY] },
        patchDetailLiked(questionId, data.liked, data.likesCount),
      );
    },
  });
}
