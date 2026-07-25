import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import {
  deleteQuestion,
  getQuestion,
  getQuestionDetailsQueryKey,
  useCreateQuestionAnswer,
  useDeleteAnswer,
  useQuestions,
} from "@/entities/question";
import { ROUTES } from "@/shared/model/routes";
import {
  EMPTY_PENDING_ANSWER_IDS,
  useQuestionCommentCount as useQuestionAnswerCount,
  useQuestionCommentsStore,
} from "@/shared/store/question-comments-store";

import { buildAnswerTree } from "./answer-tree";
import type { AnswerSortMode, QuestionAnswerNode } from "./types";
import { QUESTION_ANSWER_FORM_ID } from "./constants";

export function useQaDetailsPage(questionId: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const answerEditorRef = useRef<HTMLTextAreaElement>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [replyAnswerContent, setReplyAnswerContent] = useState("");
  const [replyToAnswerId, setReplyToAnswerId] = useState<string | null>(null);
  const [showOnlyTopLevelAnswers, setShowOnlyTopLevelAnswers] = useState(false);
  const [answerSortMode, setAnswerSortMode] = useState<AnswerSortMode>("date");
  const [answerDeleteTarget, setAnswerDeleteTarget] =
    useState<QuestionAnswerNode | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const pendingAnswerCount = useQuestionAnswerCount(questionId);
  const pendingAnswerIds = useQuestionCommentsStore(
    (state) =>
      state.pendingAnswerIdsByQuestion[questionId] ?? EMPTY_PENDING_ANSWER_IDS,
  );
  const addPendingAnswer = useQuestionCommentsStore(
    (state) => state.addPendingAnswer,
  );
  const clearPendingAnswers = useQuestionCommentsStore(
    (state) => state.clearPendingAnswers,
  );

  const questionQuery = useQuery({
    queryKey: getQuestionDetailsQueryKey(questionId),
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
  });
  const myQuestionsQuery = useQuestions({
    filter: "my",
    limit: 1000,
  });

  const question = questionQuery.data;
  const isOwner = Boolean(
    myQuestionsQuery.data?.pages
      .flatMap((page) => page.items)
      .some((item) => item.id === questionId),
  );

  const answerThreads = useMemo(
    () => buildAnswerTree(question?.answers ?? [], answerSortMode),
    [answerSortMode, question?.answers],
  );
  const visibleAnswerCount = (question?.answers.length ?? 0) + pendingAnswerCount;

  useEffect(() => {
    if (!question || location.hash !== `#${QUESTION_ANSWER_FORM_ID}`) {
      return;
    }

    document.getElementById(QUESTION_ANSWER_FORM_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    answerEditorRef.current?.focus();
  }, [location.hash, question]);

  useEffect(() => {
    if (!question?.answers.length || !pendingAnswerIds.length) {
      return;
    }

    const resolvedIds = pendingAnswerIds.filter((answerId) =>
      question.answers.some((answer) => answer.answer_id === answerId),
    );

    if (resolvedIds.length > 0) {
      clearPendingAnswers(questionId, resolvedIds);
    }
  }, [clearPendingAnswers, pendingAnswerIds, question?.answers, questionId]);

  const createAnswerMutation = useCreateQuestionAnswer({
    onSuccess: (result, vars) => {
      addPendingAnswer(questionId, result.answer_id);
      if (vars.parentAnswer) {
        toast.success("Ответ добавлен");
        setReplyAnswerContent("");
        setReplyToAnswerId(null);
        return;
      }

      toast.success("Ответ добавлен");
      setAnswerContent("");
    },
  });
  const deleteAnswerMutation = useDeleteAnswer();

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuestion(questionId),
    onSuccess: () => {
      setDeleteOpen(false);
      toast.success("Вопрос удалён");
      navigate(ROUTES.QA, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAnswerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = answerContent.trim();
    if (!value) {
      return;
    }

    createAnswerMutation.mutate({
      questionId,
      content: value,
      parentAnswer: null,
    });
  };

  const handleReplySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = replyAnswerContent.trim();
    if (!value || !replyToAnswerId) {
      return;
    }

    createAnswerMutation.mutate({
      questionId,
      content: value,
      parentAnswer: replyToAnswerId,
    });
  };

  const handleToggleReply = (answerId: string) => {
    setReplyToAnswerId((current) => (current === answerId ? null : answerId));
    setReplyAnswerContent("");
  };

  const handleDeleteAnswer = () => {
    if (!answerDeleteTarget) {
      return;
    }

    const deletingAnswerId = answerDeleteTarget.answer_id;

    deleteAnswerMutation.mutate(
      {
        answerId: deletingAnswerId,
      },
      {
        onSuccess: () => {
          if (replyToAnswerId === deletingAnswerId) {
            setReplyToAnswerId(null);
            setReplyAnswerContent("");
          }

          setAnswerDeleteTarget(null);
          toast.success("Ответ удалён");
        },
      },
    );
  };

  return {
    questionId,
    question,
    isQuestionPending: questionQuery.isPending,
    isQuestionError: questionQuery.isError,
    isOwner,
    visibleAnswerCount,
    answerThreads,
    answerSortMode,
    setAnswerSortMode,
    showOnlyTopLevelAnswers,
    setShowOnlyTopLevelAnswers,
    answerContent,
    setAnswerContent,
    replyAnswerContent,
    setReplyAnswerContent,
    replyToAnswerId,
    answerEditorRef,
    isAnswerCreating: createAnswerMutation.isPending,
    isQuestionDeleteOpen: isDeleteOpen,
    setQuestionDeleteOpen: setDeleteOpen,
    isQuestionDeleting: deleteMutation.isPending,
    onQuestionDeleteConfirm: () => deleteMutation.mutate(),
    answerDeleteTarget,
    setAnswerDeleteTarget,
    isAnswerDeleting: deleteAnswerMutation.isPending,
    onAnswerDeleteConfirm: handleDeleteAnswer,
    handleAnswerSubmit,
    handleReplySubmit,
    handleToggleReply,
  };
}
