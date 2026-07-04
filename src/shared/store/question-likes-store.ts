import { create } from "zustand";

type QuestionLikesState = {
  likedQuestionIds: Record<string, boolean>;
  setQuestionLiked: (questionId: string, liked: boolean) => void;
};

export const useQuestionLikesStore = create<QuestionLikesState>((set) => ({
  likedQuestionIds: {},
  setQuestionLiked: (questionId, liked) => {
    set((state) => {
      const next = { ...state.likedQuestionIds };

      if (liked) {
        next[questionId] = true;
      } else {
        delete next[questionId];
      }

      return { likedQuestionIds: next };
    });
  },
}));

export function useQuestionLikeState(questionId: string): boolean {
  return useQuestionLikesStore(
    (state) => state.likedQuestionIds[questionId] ?? false,
  );
}
