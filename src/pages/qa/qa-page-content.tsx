import { useState } from "react";
import { useNavigate } from "react-router";

import { FiltersMobile, FiltersSidebar, TagsFilterSection, useFilters } from "@/widgets/filters";
import { FilterTabs } from "@/widgets/filter-tabs";
import { Search } from "@/widgets/search";
import { PageContainer } from "@/shared/ui/page-container";
import { Button } from "@/shared/ui/button";
import { useQuestions } from "@/entities/question";
import { mapQuestion } from "@/pages/qa/model/question-mapper";
import { qaTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { TAB_TO_FILTER } from "@/pages/qa/model/tabs";
import { QaList } from "@/pages/qa/ui/qa-list";
import { ROUTES } from "@/shared/model/routes.ts";

export function QAPageContent() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const [search, setSearch] = useState("");
  const { selected, reset } = useFilters();
  const tags = selected["tags"] ?? [];

  const { data, isLoading, isError } = useQuestions({
    filter: TAB_TO_FILTER[tab],
    search,
    tags,
  });

  const questions = data?.pages.flatMap((page) => page.items.map(mapQuestion)) ?? [];

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
          <QaList questions={questions} isLoading={isLoading} isError={isError} />
        </main>
      </div>
    </PageContainer>
  );
}