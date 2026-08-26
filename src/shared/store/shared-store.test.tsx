import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useAnswerLikeState, useAnswerLikesStore } from "./answer-likes-store";
import { useAuthModalStore } from "./auth-modal-store";
import { EMPTY_PENDING_ANSWER_IDS, useQuestionCommentCount, useQuestionCommentsStore } from "./question-comments-store";

afterEach(() => {
  useAnswerLikesStore.setState({ likedAnswerIds: {} });
  useAuthModalStore.setState({ isOpen: false, redirectPath: null });
  useQuestionCommentsStore.setState({ pendingAnswerIdsByQuestion: {} });
});

describe("shared Zustand stores", () => {
  it("sets and clears a per-answer like state", () => {
    // Init
    const { result } = renderHook(() => useAnswerLikeState("answer-1"));

    // Action
    act(() => useAnswerLikesStore.getState().setAnswerLiked("answer-1", true));

    // Assert
    expect(result.current).toBe(true);
    act(() => useAnswerLikesStore.getState().setAnswerLiked("answer-1", false));
    expect(useAnswerLikesStore.getState().likedAnswerIds).toEqual({});
  });

  it("opens the auth modal and manages its redirect", () => {
    // Init
    const store = useAuthModalStore.getState();

    // Action
    act(() => {
      store.openModal();
      store.setRedirectPath("/projects");
    });

    // Assert
    expect(useAuthModalStore.getState()).toMatchObject({ isOpen: true, redirectPath: "/projects" });
    act(() => {
      useAuthModalStore.getState().closeModal();
      useAuthModalStore.getState().clearRedirectPath();
    });
    expect(useAuthModalStore.getState()).toMatchObject({ isOpen: false, redirectPath: null });
  });

  it("deduplicates and selectively clears pending answer IDs", () => {
    // Init
    const { result } = renderHook(() => useQuestionCommentCount("question-1"));

    // Action
    act(() => {
      useQuestionCommentsStore.getState().addPendingAnswer("question-1", "a");
      useQuestionCommentsStore.getState().addPendingAnswer("question-1", "a");
      useQuestionCommentsStore.getState().addPendingAnswer("question-1", "b");
      useQuestionCommentsStore.getState().clearPendingAnswers("question-1", ["a"]);
    });

    // Assert
    expect(result.current).toBe(1);
    expect(EMPTY_PENDING_ANSWER_IDS).toEqual([]);
    act(() => useQuestionCommentsStore.getState().clearPendingAnswers("question-1"));
    expect(result.current).toBe(0);
  });
});
