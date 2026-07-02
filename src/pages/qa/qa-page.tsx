import { Search } from "@/widgets/search";
import { TagsList } from "@/widgets/tags";
import { QuestionCard } from "@/widgets/question-card";
import { PageContainer } from "@/shared/ui/page-container";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router";
import { FilterTabs } from "@/widgets/filter-tabs/ui/filter-tabs";
import { qaTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { useState } from "react";
import { useQuestions } from "@/entities/question";
import type { QuestionsFilter } from "@/entities/question/model/types";
import { mapQuestion } from "@/pages/qa/model/question-mapper";

const TAB_TO_FILTER: Record<string, QuestionsFilter | undefined> = {
  new: undefined,
  popular: "popular",
  unanswered: "no_answers",
  "my-questions": "my"
}
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
        Не удалось загрузить список вопросов. Попробуйте перезагрузить страницу.
      </p>
    </div>
  );
}

const QAPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data, isLoading, isError } = useQuestions({
    filter: TAB_TO_FILTER[tab],
    search,
    tags: selectedTags
  });
  const questions = data?.pages.flatMap((page) => page.items.map(mapQuestion)) ?? [];

  return (
    <PageContainer className="py-8">
      <Search onSearch={setSearch} placeholder="Поиск вопросов" />
      <div className="md:grid md:grid-cols-[217px_minmax(0,1fr)] lg:gap-26.5">
        <h1 className="mb-4 text-[26px] leading-8 font-bold md:hidden">Q&A</h1>
        <aside>
          <TagsList selectedTags={selectedTags} onTagsChange={setSelectedTags}/>
        </aside>
        <main className="flex flex-col md:gap-8.5">
          <div className="flex justify-between">
            <FilterTabs items={qaTabs} value={tab} onValueChange={setTab} />
            <Button
              variant="ghost"
              size="lg"
              className="hidden text-[16px] md:flex lg:text-lg"
              onClick={() => navigate("/qa/create")}
            >
              Задать вопрос
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="fixed top-1/2 right-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)] z-50 md:hidden"
              onClick={() => navigate("/qa/create")}
            >
              Задать вопрос
            </Button>
          </div>
          {isLoading && <QaListSkeleton />}
          {isError && <QaListError />}
          {!isLoading &&
            !isError &&
            questions.map((question) => (
              <QuestionCard question={question} key={question.id} />
            ))}
        </main>
      </div>
    </PageContainer>
  );
}

export const Component = QAPage;
