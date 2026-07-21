import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Link, generatePath, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  createQuestionAnswer,
  deleteQuestion,
  getQuestion,
  QuestionLikeButton,
  QUESTIONS_QUERY_KEY,
  useQuestions,
} from "@/entities/question";
import type { QuestionAnswerImage} from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { ROUTES } from "@/shared/model/routes";
import AvatarPlaceholder from "@/shared/assets/images/avatar.png";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { PageContainer } from "@/shared/ui/page-container";
import { Tag } from "@/shared/ui/tag";
import {
  EMPTY_PENDING_ANSWER_IDS,
  useQuestionCommentCount,
  useQuestionCommentsStore,
} from "@/shared/store/question-comments-store";
import { QuestionAnswerCard } from "./ui/question-answer-card";
import { QuestionAnswerForm } from "./ui/question-answer-form";
import { QuestionError } from "./ui/question-error";
import { QuestionLoading } from "./ui/question-loading";

function QaDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const questionId = id ?? "";
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<QuestionAnswerImage[]>([]);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const pendingCommentCount = useQuestionCommentCount(questionId);
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
    queryKey: ["question-details", questionId],
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

  const answers = useMemo(
    () =>
      [...(question?.answers ?? [])].sort(
        (left, right) =>
          new Date(left.created_at).getTime() -
          new Date(right.created_at).getTime(),
      ),
    [question?.answers],
  );
  const visibleCommentCount = answers.length + pendingCommentCount;

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

  const addCommentMutation = useMutation({
    mutationFn: ({
      content,
      images,
    }: {
      content: string;
      images: QuestionAnswerImage[];
    }) =>
      createQuestionAnswer(questionId, {
        content,
        parent_answer: null,
        images,
      }),
    onSuccess: (result) => {
      addPendingAnswer(questionId, result.answer_id);
      toast.success("Комментарий добавлен");
      setComment("");
      setImages([]);
      void questionQuery.refetch();
      void queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = comment.trim();
    if (!value) {
      return;
    }

    addCommentMutation.mutate({
      content: value,
      images,
    });
  };

  if (questionQuery.isPending) {
    return <QuestionLoading />;
  }

  if (questionQuery.error || !question) {
    return <QuestionError />;
  }

  return (
    <PageContainer className="py-8 max-md:px-4 md:py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 hidden cursor-pointer items-center gap-2 text-base font-semibold text-foreground transition-colors hover:text-primary md:inline-flex"
      >
        <Icon icon="ph:arrow-left" className="size-6" />
        Назад
      </button>

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Назад"
        className="mb-5 inline-flex cursor-pointer items-center gap-2 text-foreground transition-colors hover:text-primary md:hidden"
      >
        <Icon icon="ph:arrow-left" className="size-6" />
      </button>

      <div className="grid gap-4 xl:grid-cols-[273px_1fr] xl:gap-13">
        <Card className="h-fit rounded-2xl">
          <CardContent className="!px-5 !py-6">
            <div className="flex items-start gap-3">
              <Avatar className="size-14">
                <AvatarImage
                  src={AvatarPlaceholder}
                  alt={question.author_name}
                />
                <AvatarFallback>
                  <Icon icon="ph:user" className="size-6" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="text-lg font-semibold text-foreground">
                  {question.author_name}
                </div>

                <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <Icon icon="ph:thumbs-up" className="size-5" />
                  <span>{question.author_rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div>Опубликовано {formatRelativeDate(question.created_at)}</div>
              <div>Лайков: {question.likes_count}</div>
              <div>Комментариев: {visibleCommentCount}</div>
            </div>

            {isOwner && (
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full"
                  disabled={deleteMutation.isPending}
                >
                  <Link to={generatePath(ROUTES.QA_EDIT, { id: questionId })}>
                    Редактировать
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="h-11 w-full"
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteOpen(true)}
                >
                  {deleteMutation.isPending ? "Удаление..." : "Удалить"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-4">
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col gap-6 !p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-[26px] leading-[1.2] font-bold tracking-normal">
                    {question.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Tag
                        key={tag}
                        variant="outline"
                        className="text-[18px] leading-[150%] font-normal tracking-normal"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>

              <p className="max-w-4xl text-[18px] leading-[1.4] font-medium text-foreground">
                {question.description}
              </p>

              {question.images.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt={question.title}
                      className="max-h-[320px] w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-6 px-6 pt-0 pb-6 text-muted-foreground">
              <QuestionLikeButton
                questionId={question.question_id}
                likesCount={question.likes_count}
              />
              <div className="flex items-center gap-2">
                <Icon icon="ph:chat-teardrop-dots" className="size-6" />
                <span>{visibleCommentCount}</span>
              </div>
            </CardFooter>
          </Card>

          <QuestionAnswerForm
            value={comment}
            onChange={setComment}
            onSubmit={handleSubmit}
            isSubmitting={addCommentMutation.isPending}
            images={images}
            onImagesChange={setImages}
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-foreground">
                Комментарии
              </h2>
              <span className="text-sm text-muted-foreground">
                {visibleCommentCount} шт.
              </span>
            </div>

            {answers.length > 0 ? (
              answers.map((answer) => (
                <QuestionAnswerCard key={answer.answer_id} answer={answer} />
              ))
            ) : (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="!p-6 text-muted-foreground">
                  Пока нет комментариев.
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        icon="ph:trash"
        title="Удалить вопрос?"
        description="Это действие приведёт к безвозвратному удалению вопроса"
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
}

export const Component = QaDetailsPage;