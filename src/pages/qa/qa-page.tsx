import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generatePath, useNavigate } from "react-router";
import { toast } from "sonner";

import {
  deleteQuestion,
  useQuestions,
  type QuestionListFilter,
  type QuestionListItemDto,
} from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { ROUTES } from "@/shared/model/routes";
import { PageContainer } from "@/shared/ui/page-container";
import { Button } from "@/shared/ui/button";
import { FilterTabs } from "@/widgets/filter-tabs/ui/filter-tabs";
import { qaTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { MyQuestionsCard } from "@/widgets/my-questions/ui/my-questions";
import { QuestionCard } from "@/widgets/question-card";
import { Search } from "@/widgets/search";
import { TagsList } from "@/widgets/tags";

const QUESTION_FILTER_BY_TAB: Record<string, QuestionListFilter | undefined> = {
  new: undefined,
  popular: "popular",
  unanswered: "no_answers",
  "my-questions": "my",
};

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

function QaListError() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-muted-foreground">
        Не удалось загрузить список вопросов. Попробуйте перезагрузить
        страницу.
      </p>
    </div>
  );
}

const QAPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const [search, setSearch] = useState("");
  const [questionToDelete, setQuestionToDelete] =
    useState<QuestionListItemDto | null>(null);

  const questionsQuery = useQuestions({
    filter: QUESTION_FILTER_BY_TAB[tab],
    search,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success("Вопрос удалён");
      setQuestionToDelete(null);
      void questionsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const questions = questionsQuery.data?.items ?? [];
  const isMyQuestionsTab = tab === "my-questions";

  const handleConfirmDelete = () => {
    if (!questionToDelete) {
      return;
    }

    deleteMutation.mutate(questionToDelete.question_id);
  };

  return (
    <PageContainer className="py-8">
      <Search onSearch={setSearch} />
      <div className="md:grid md:grid-cols-[217px_minmax(0,1fr)] lg:gap-[106px]">
        <h1 className="mb-4 text-[26px] leading-[32px] font-bold md:hidden">
          Q&A
        </h1>
        <aside>
          <TagsList />
        </aside>
        <main className="flex flex-col md:gap-8.5">
          <div className="flex justify-between">
            <FilterTabs items={qaTabs} value={tab} onValueChange={setTab} />
            <Button
              variant="ghost"
              size="lg"
              className="hidden text-[16px] md:flex lg:text-lg"
              onClick={() => navigate(ROUTES.QA_CREATE)}
            >
              Задать вопрос
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="fixed top-1/2 right-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)] z-50 md:hidden"
              onClick={() => navigate(ROUTES.QA_CREATE)}
            >
              Задать вопрос
            </Button>
          </div>

          {questionsQuery.isPending ? (
            <QaListSkeleton />
          ) : questionsQuery.isError ? (
            <QaListError />
          ) : questions.length > 0 ? (
            questions.map((question) =>
              isMyQuestionsTab ? (
                <MyQuestionsCard
                  key={question.question_id}
                  question={question}
                  editHref={generatePath(ROUTES.QA_EDIT, {
                    id: question.question_id,
                  })}
                  onDelete={() => setQuestionToDelete(question)}
                  isDeleting={
                    deleteMutation.isPending &&
                    questionToDelete?.question_id === question.question_id
                  }
                />
              ) : (
                <QuestionCard key={question.question_id} question={question} />
              ),
            )
          ) : (
            <p className="text-base text-foreground">Вопросов пока нет.</p>
          )}
        </main>
      </div>

      <ConfirmModal
        open={Boolean(questionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setQuestionToDelete(null);
          }
        }}
        icon="ph:trash"
        title="Удалить вопрос?"
        description={
          questionToDelete
            ? `Вопрос «${questionToDelete.title}» будет удалён без возможности восстановления.`
            : "Вопрос будет удалён без возможности восстановления."
        }
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
};

export const Component = QAPage;
