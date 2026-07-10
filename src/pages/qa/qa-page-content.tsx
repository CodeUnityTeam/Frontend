import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteQuestion, useQuestions } from "@/entities/question";
import { ConfirmModal } from "@/features/confirm-modal";
import { FiltersMobile, FiltersSidebar, TagsFilterSection, useFilters } from "@/widgets/filters";
import { FilterTabs } from "@/widgets/filter-tabs";
import { Search } from "@/widgets/search";
import { PageContainer } from "@/shared/ui/page-container";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/model/routes";
import type { QuestionData } from "@/widgets/question-card";
import { mapQuestion } from "@/pages/qa/model/question-mapper";
import { qaTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { TAB_TO_FILTER } from "@/pages/qa/model/tabs";
import { QaList } from "@/pages/qa/ui/qa-list";

export function QAPageContent() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const [search, setSearch] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState<QuestionData | null>(null);
  const { selected, reset } = useFilters();
  const tags = selected["tags"] ?? [];

  const questionsQuery = useQuestions({
    filter: TAB_TO_FILTER[tab],
    search,
    tags,
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

  const questions =
    questionsQuery.data?.pages.flatMap((page) => page.items.map(mapQuestion)) ?? [];
  const isMyTab = tab === "my-questions";
  const totalQuestions = questionsQuery.data?.pages[0]?.count ?? questions.length;
  const remainingQuestions = Math.max(totalQuestions - questions.length, 0);

  return (
    <PageContainer className="py-8">
      <h1 className="mb-4 text-[26px] leading-8 font-bold md:hidden">Q&A</h1>
      <Search onSearch={setSearch} placeholder="Поиск вопросов" />

      <div className="mb-6 flex items-center lg:hidden">
        <FiltersMobile>
          <TagsFilterSection />
        </FiltersMobile>
      </div>

      <div className="mb-6 hidden lg:flex lg:items-center lg:gap-5">
        <div className="flex w-103.25 shrink-0 items-center justify-between">
          <h2 className="text-[26px] leading-8 font-bold text-foreground">Фильтры</h2>
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer py-3 text-base font-semibold text-foreground transition-colors hover:text-primary"
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="lg:flex lg:items-start lg:gap-5">
        <FiltersSidebar className="hidden lg:block shrink-0">
          <TagsFilterSection />
        </FiltersSidebar>

        <main className="flex-1 flex flex-col md:gap-8.5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <FilterTabs items={qaTabs} value={tab} onValueChange={setTab} />
            </div>
            <Button
              variant="ghost"
              size="lg"
              className="hidden shrink-0 text-[16px] md:flex lg:text-lg"
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

          <QaList
            questions={questions}
            isLoading={questionsQuery.isPending}
            isError={questionsQuery.isError}
            isMyTab={isMyTab}
            onDelete={setQuestionToDelete}
            deletingId={deleteMutation.isPending ? (questionToDelete?.id ?? undefined) : undefined}
            hasNextPage={questionsQuery.hasNextPage}
            onLoadMore={() => questionsQuery.fetchNextPage()}
            isFetchingNextPage={questionsQuery.isFetchingNextPage}
            remainingCount={remainingQuestions}
          />
        </main>
      </div>

      <ConfirmModal
        open={Boolean(questionToDelete)}
        onOpenChange={(open) => { if (!open) setQuestionToDelete(null); }}
        icon="ph:trash"
        title="Удалить вопрос?"
        description={
          questionToDelete
            ? `Вопрос «${questionToDelete.title}» будет удалён без возможности восстановления.`
            : "Вопрос будет удалён без возможности восстановления."
        }
        confirmText="Удалить"
        cancelText="Отменить"
        onConfirm={() => { if (questionToDelete) deleteMutation.mutate(questionToDelete.id); }}
        isLoading={deleteMutation.isPending}
        loadingText="Удаление..."
      />
    </PageContainer>
  );
}
