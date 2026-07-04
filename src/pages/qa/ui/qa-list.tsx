import { Icon } from "@iconify/react";
import { generatePath } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { QuestionCard, type QuestionData } from "@/widgets/question-card";
import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";

function QaListSkeleton() {
  return (
    <div className="flex flex-col gap-8.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`question-skeleton-${index}`}
          className="h-55 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

function QaListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-muted px-6 py-16 text-center">
      <Icon icon="ph:chat-circle-dots" className="size-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">Вопросов не найдено</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        Попробуйте изменить фильтры или поисковый запрос
      </p>
    </div>
  );
}

function QaListError() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить список вопросов. Попробуйте перезагрузить страницу.
      </p>
    </div>
  );
}

type QaListProps = {
  questions: QuestionData[];
  isLoading: boolean;
  isError: boolean;
  isMyTab: boolean;
  onDelete: (question: QuestionData) => void;
  deletingId?: string;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
  remainingCount?: number;
};

export function QaList({
  questions,
  isLoading,
  isError,
  isMyTab,
  onDelete,
  deletingId,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  remainingCount,
}: QaListProps) {
  if (isLoading) return <QaListSkeleton />;
  if (isError) return <QaListError />;
  if (questions.length === 0) return <QaListEmpty />;

  return (
    <div className="flex flex-col gap-6 lg:gap-8.5">
      <ul className="flex flex-col gap-6 lg:gap-8.5">
        {questions.map((question) =>
          isMyTab ? (
            <li key={question.id}>
              <MyQuestionsCard
                question={question}
                editHref={generatePath(ROUTES.QA_EDIT, { id: question.id })}
                onDelete={() => onDelete(question)}
                isDeleting={deletingId === question.id}
              />
            </li>
          ) : (
            <li key={question.id}>
              <QuestionCard question={question} />
            </li>
          ),
        )}
      </ul>

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Загрузка..." : `Загрузить ещё ${remainingCount}`}
          </Button>
        </div>
      )}
    </div>
  );
}
