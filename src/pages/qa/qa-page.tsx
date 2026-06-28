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

const QAPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");

  const {data, isLoading, isError} = useQuestions({filter: TAB_TO_FILTER[tab]});
  const questions = data?.pages.flatMap((page) => page.items.map(mapQuestion)) ?? [];

  return (
    <PageContainer className="py-8">
      <Search />
      <div className="md:grid md:grid-cols-[217px_minmax(0,1fr)] lg:gap-[106px]">
        <h1 className="mb-4 text-[26px] leading-[32px] font-bold md:hidden">
          Q&A
        </h1>
        <aside>
          <TagsList />
        </aside>
        <main className="flex flex-col md:gap-[34px]">
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
          {isLoading && <div>Загрузка...</div>}
          {isError && <div>Не удалось загрузить вопросы</div>}
          {!isLoading && !isError &&
            questions.map((question) => (
              <QuestionCard question={question} key={question.id} />
            )
          )}
        </main>
      </div>
    </PageContainer>
  );
}

export const Component = QAPage;
