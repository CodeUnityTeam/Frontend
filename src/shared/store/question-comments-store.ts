import { create } from "zustand";

export const EMPTY_PENDING_ANSWER_IDS: string[] = [];

type QuestionCommentsState = {
  pendingAnswerIdsByQuestion: Record<string, string[]>;
  addPendingAnswer: (questionId: string, answerId: string) => void;
  clearPendingAnswers: (questionId: string, answerIds?: string[]) => void;
};

export const useQuestionCommentsStore = create<QuestionCommentsState>(
  (set) => ({
    pendingAnswerIdsByQuestion: {},
    addPendingAnswer: (questionId, answerId) => {
      set((state) => {
        const current = state.pendingAnswerIdsByQuestion[questionId] ?? [];
        if (current.includes(answerId)) {
          return state;
        }

        return {
          pendingAnswerIdsByQuestion: {
            ...state.pendingAnswerIdsByQuestion,
            [questionId]: [...current, answerId],
          },
        };
      });
    },
    clearPendingAnswers: (questionId, answerIds) => {
      set((state) => {
        const current = state.pendingAnswerIdsByQuestion[questionId] ?? [];

        if (!current.length) {
          return state;
        }

        if (!answerIds?.length) {
          const next = { ...state.pendingAnswerIdsByQuestion };
          delete next[questionId];
          return { pendingAnswerIdsByQuestion: next };
        }

        const nextIds = current.filter((id) => !answerIds.includes(id));

        if (nextIds.length === current.length) {
          return state;
        }

        const next = { ...state.pendingAnswerIdsByQuestion };

        if (nextIds.length) {
          next[questionId] = nextIds;
        } else {
          delete next[questionId];
        }

        return { pendingAnswerIdsByQuestion: next };
      });
    },
  }),
);

export function useQuestionCommentCount(questionId: string): number {
  return useQuestionCommentsStore(
    (state) => state.pendingAnswerIdsByQuestion[questionId]?.length ?? 0,
  );
}
