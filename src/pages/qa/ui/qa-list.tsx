import { useMemo } from "react";

import { generatePath } from "react-router";

import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { QuestionCard, type QuestionData } from "@/widgets/question-card";
import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";
import type { QaTab, QaUnansweredSort } from "@/pages/qa/model/tabs";
import { QaListSkeleton } from "./qa-list-skeleton";
import { QaListEmpty } from "./qa-list-empty";
import { QaListError } from "./qa-list-error";


type QaListProps = {
  questions: QuestionData[];
  isLoading: boolean;
  isError: boolean;
  tab: QaTab;
  unansweredSort: QaUnansweredSort;
  isMyTab: boolean;
  onDelete?: (question: QuestionData) => void;
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
  tab,
  unansweredSort,
  isMyTab,
  onDelete,
  deletingId,
  hasNextPage,
  onLoadMore,
  isFetchingNextPage,
  remainingCount,
}: QaListProps) {
  const sortedQuestions = useMemo(() => {
    const items = [...questions];
    const sortByDate = (left: QuestionData, right: QuestionData) =>
      right.createdAt.getTime() - left.createdAt.getTime();
    const sortByLikes = (left: QuestionData, right: QuestionData) => {
      const likesDelta = right.likes - left.likes;
      if (likesDelta !== 0) {
        return likesDelta;
      }

      return sortByDate(left, right);
    };

    if (tab === "unanswered") {
      return items
        .filter((question) => question.comments === 0)
        .sort(unansweredSort === "likes" ? sortByLikes : sortByDate);
    }

    if (tab === "popular") {
      return items.sort(sortByLikes);
    }

    return items.sort(sortByDate);
  }, [questions, tab, unansweredSort]);

  if (isLoading) return <QaListSkeleton />;
  if (isError) return <QaListError />;
  if (sortedQuestions.length === 0) return <QaListEmpty />;

  return (
    <div className="flex flex-col gap-6 lg:gap-8.5">
      <ul className="flex flex-col gap-6 lg:gap-8.5">
        {sortedQuestions.map((question) =>
          isMyTab ? (
            <li key={question.id}>
              <MyQuestionsCard
                question={question}
                editHref={generatePath(ROUTES.QA_EDIT, { id: question.id })}
                onDelete={onDelete ? () => onDelete(question) : undefined}
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
