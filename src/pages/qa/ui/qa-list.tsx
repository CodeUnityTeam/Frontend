import { generatePath } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { QuestionCard, type QuestionData } from "@/widgets/question-card";
import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";
import { QaListSkeleton } from "./qa-list-skeleton";
import { QaListEmpty } from "./qa-list-empty";
import { QaListError } from "./qa-list-error";


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
            {isFetchingNextPage
              ? "Загрузка..."
              : `Загрузить ещё ${remainingCount}`}
          </Button>
        </div>
      )}
    </div>
  );
}
