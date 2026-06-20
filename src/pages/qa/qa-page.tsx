import { Search } from "@/widgets/search";
import { TagsList } from "@/widgets/tags";
import { QuestionCard } from "@/widgets/question-card";
import { testQuestion } from "@/pages/qa/model/mocks";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router";
import { FilterTabs } from "@/widgets/filter-tabs/ui/filter-tabs";
import { qaTabs } from "@/widgets/filter-tabs/model/tabs-data";
import { useState } from "react";

const QAPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  return (
    <div className="md:grid px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)] md:grid-cols-[217px_minmax(0,1fr)] lg:gap-[106px]">
      <h1 className="text-[26px] leading-[32px] font-bold mb-4 md:hidden">Q&A</h1>
      <aside>
        <TagsList />
      </aside>
      <main className="flex flex-col md:gap-[34px]">
        <div className="flex justify-between">
          <FilterTabs items={qaTabs} value={tab} onValueChange={setTab} />
          <Button
          variant="ghost"
          size="lg"
          className="hidden md:flex text-[16px] lg:text-lg"
          onClick={() => navigate("/qa/create")}
          >
          Задать вопрос
        </Button>
          <Button
          variant="outline"
          size="lg"
          className="
            fixed
            top-1/2
            right-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]
            z-50
            md:hidden"
          onClick={() => navigate("/qa/create")}
          >
          Задать вопрос
      </Button>
        </div>
        {[testQuestion].map((question) => <QuestionCard question={question} key={question.id}/>)}
      </main>
      
    </div>
  )
}

export const Component = QAPage;
