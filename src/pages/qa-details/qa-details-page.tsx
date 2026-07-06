import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, Ref } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import {
  Link,
  generatePath,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { toast } from "sonner";
import {
  AnswerLikeButton,
  deleteQuestion,
  getQuestion,
  getQuestionDetailsQueryKey,
  QuestionLikeButton,
  type QuestionAnswerDto,
  useCreateQuestionAnswer,
  useDeleteAnswer,
  useQuestions,
} from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { ROUTES } from "@/shared/model/routes";
import AvatarPlaceholder from "@/shared/assets/images/avatar.png";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { PageContainer } from "@/shared/ui/page-container";
import { Tag } from "@/shared/ui/tag";
import { Textarea } from "@/shared/ui/textarea";
import {
  EMPTY_PENDING_ANSWER_IDS,
  useQuestionCommentCount as useQuestionAnswerCount,
  useQuestionCommentsStore,
} from "@/shared/store/question-comments-store";
import { QuestionError } from "./ui/question-error";
import { QuestionLoading } from "./ui/question-loading";

const QUESTION_ANSWER_FORM_ID = "question-answer-form";

type QuestionAnswerNode = QuestionAnswerDto & {
  replies: QuestionAnswerNode[];
};

function compareAnswersByDate(left: QuestionAnswerDto, right: QuestionAnswerDto) {
  return (
    new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
  );
}

function buildAnswerTree(answers: QuestionAnswerDto[]): QuestionAnswerNode[] {
  const nodes = new Map<string, QuestionAnswerNode>();
  const roots: QuestionAnswerNode[] = [];

  for (const answer of answers) {
    nodes.set(answer.answer_id, {
      ...answer,
      replies: [],
    });
  }

  for (const node of nodes.values()) {
    if (node.parent_answer_id) {
      const parent = nodes.get(node.parent_answer_id);
      if (parent) {
        parent.replies.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  const sortTree = (items: QuestionAnswerNode[]) => {
    items.sort(compareAnswersByDate);
    items.forEach((item) => {
      if (item.replies.length > 0) {
        sortTree(item.replies);
      }
    });
  };

  sortTree(roots);
  return roots;
}

function QuestionAnswerForm({
  title,
  description,
  label,
  value,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Отправить",
  onCancel,
  cancelLabel = "Отмена",
  className,
  id,
  textareaRef,
}: {
  title: string;
  description: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  className?: string;
  id?: string;
  textareaRef?: Ref<HTMLTextAreaElement>;
}) {
  return (
    <Card
      id={id}
      className={cn("rounded-[24px] border border-input", className)}
    >
      <CardHeader className="gap-2 p-6 pb-0">
        <CardTitle className="text-[24px] leading-[1.2] font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Textarea
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            ref={textareaRef}
            className="rounded-2xl border-foreground [&>textarea]:min-h-[160px] [&>textarea]:min-w-0 [&>textarea]:overflow-auto"
          />

          <div className="flex flex-wrap justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="min-w-[140px]"
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !value.trim()}
              className="min-w-[180px]"
            >
              {isSubmitting ? "Отправка..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
function QaDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const questionId = id ?? "";
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [replyAnswerContent, setReplyAnswerContent] = useState("");
  const [replyToAnswerId, setReplyToAnswerId] = useState<string | null>(null);
  const [showOnlyTopLevelAnswers, setShowOnlyTopLevelAnswers] = useState(false);
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
    () => buildAnswerTree(question?.answers ?? []),
    [question?.answers],
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
    answerTextareaRef.current?.focus();
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

  const renderAnswerThread = (
    answer: QuestionAnswerNode,
    depth = 0,
    showReplies = true,
  ) => {
    const isReplyOpen = replyToAnswerId === answer.answer_id;

    return (
      <div key={answer.answer_id} className={cn(depth > 0 && "pl-5 sm:pl-8")}>
        <Card
          className={cn(
            "h-fit rounded-2xl border-muted-foreground",
            depth > 0 && "border-dashed bg-muted/20 shadow-none",
          )}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 pb-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Avatar className="size-12">
                <AvatarImage src={AvatarPlaceholder} alt={answer.author_name} />
                <AvatarFallback>
                  <Icon icon="ph:user" className="size-6" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold text-foreground",
                      depth > 0 ? "text-lg" : "text-xl",
                    )}
                  >
                    {answer.author_name}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon icon="ph:thumbs-up" className="size-5" />
                    <span className={cn(depth > 0 ? "text-base" : "text-lg")}>
                      {answer.author_rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              {formatRelativeDate(answer.created_at)}
            </span>
          </CardHeader>

          <CardContent
            className={cn(
              "space-y-4 pt-0",
              depth > 0 ? "p-5" : "p-6",
            )}
          >
            <p className="whitespace-pre-line text-lg leading-7 text-foreground">
              {answer.content}
            </p>

            {answer.images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {answer.images.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={answer.author_name}
                    className="max-h-[320px] w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap items-center gap-4 px-6 pb-6 pt-0 text-muted-foreground">
            <AnswerLikeButton
              answerId={answer.answer_id}
              likesCount={answer.likes_count}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyToAnswerId(
                  isReplyOpen ? null : answer.answer_id,
                );
                setReplyAnswerContent("");
              }}
              className="gap-2 px-3 font-medium text-muted-foreground hover:text-primary"
            >
              <Icon icon="ph:arrow-bend-down-right" className="size-5" />
              <span>{isReplyOpen ? "Скрыть ответ" : "Ответить"}</span>
            </Button>

            {answer.is_owned_by_me && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAnswerDeleteTarget(answer)}
                className="gap-2 px-3 font-medium text-destructive hover:text-destructive"
              >
                <Icon icon="ph:trash" className="size-5" />
                <span>Удалить</span>
              </Button>
            )}
          </CardFooter>
        </Card>

        {isReplyOpen && (
          <div className="mt-4 pl-5 sm:pl-8">
            <QuestionAnswerForm
              title="Ответить"
              description="Ответ будет добавлен в эту ветку."
              label="Ответ"
              value={replyAnswerContent}
              onChange={setReplyAnswerContent}
              onSubmit={handleReplySubmit}
              onCancel={() => {
                setReplyToAnswerId(null);
                setReplyAnswerContent("");
              }}
              cancelLabel="Отменить"
              submitLabel="Отправить ответ"
              isSubmitting={createAnswerMutation.isPending}
              className="border-dashed"
            />
          </div>
        )}

        {showReplies && answer.replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l border-dashed pl-4 sm:pl-6">
            {answer.replies.map((reply) =>
              renderAnswerThread(reply, depth + 1, showReplies),
            )}
          </div>
        )}
      </div>
    );
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
              <div>Ответов: {visibleAnswerCount}</div>
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
              <Button
                asChild
                variant="ghost"
                className="gap-2 px-3 font-medium text-muted-foreground hover:text-primary"
              >
                <Link to={`${generatePath(ROUTES.QA_DETAILS, { id: questionId })}#${QUESTION_ANSWER_FORM_ID}`}>
                  <Icon icon="ph:arrow-bend-down-right" className="size-5" />
                  <span>Ответить</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Icon icon="ph:chat-teardrop-dots" className="size-6" />
                <span>{visibleAnswerCount}</span>
              </div>
            </CardFooter>
          </Card>

          <QuestionAnswerForm
            id={QUESTION_ANSWER_FORM_ID}
            title="Добавить ответ"
            description="Поделитесь опытом, уточните деталь или оставьте полезный ответ."
            label="Ответ"
            value={answerContent}
            onChange={setAnswerContent}
            onSubmit={handleAnswerSubmit}
            isSubmitting={createAnswerMutation.isPending}
            submitLabel="Отправить"
            textareaRef={answerTextareaRef}
          />

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold text-foreground">
                  Ответы
                </h2>
                <span className="text-sm text-muted-foreground">
                  {visibleAnswerCount} шт.
                </span>
              </div>

              <Button
                type="button"
                variant={showOnlyTopLevelAnswers ? "default" : "outline"}
                onClick={() =>
                  setShowOnlyTopLevelAnswers((current) => !current)
                }
                className="h-10 rounded-xl px-4 text-sm font-medium"
              >
                {showOnlyTopLevelAnswers ? "Только ответы" : "Ответы и обсуждения"}
              </Button>
            </div>

            {answerThreads.length > 0 ? (
              answerThreads.map((answer) =>
                renderAnswerThread(answer, 0, !showOnlyTopLevelAnswers),
              )
            ) : (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="!p-6 text-muted-foreground">
                  Пока нет ответов.
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

      <ConfirmModal
        open={Boolean(answerDeleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setAnswerDeleteTarget(null);
          }
        }}
        icon="ph:trash"
        title="Удалить ответ?"
        description={
          answerDeleteTarget?.replies.length
            ? "Ответ будет удалён, а его дочерние ответы останутся в ветке."
            : "Ответ будет удалён без возможности восстановления."
        }
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={handleDeleteAnswer}
        isLoading={deleteAnswerMutation.isPending}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
}

export const Component = QaDetailsPage;
