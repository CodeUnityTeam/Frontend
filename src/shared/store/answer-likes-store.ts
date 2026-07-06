import { create } from "zustand";

type AnswerLikesState = {
  likedAnswerIds: Record<string, boolean>;
  setAnswerLiked: (answerId: string, liked: boolean) => void;
};

export const useAnswerLikesStore = create<AnswerLikesState>((set) => ({
  likedAnswerIds: {},
  setAnswerLiked: (answerId, liked) => {
    set((state) => {
      const next = { ...state.likedAnswerIds };

      if (liked) {
        next[answerId] = true;
      } else {
        delete next[answerId];
      }

      return { likedAnswerIds: next };
    });
  },
}));

export function useAnswerLikeState(answerId: string): boolean {
  return useAnswerLikesStore(
    (state) => state.likedAnswerIds[answerId] ?? false,
  );
}
