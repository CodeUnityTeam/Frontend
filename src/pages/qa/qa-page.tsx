import { cn } from "@/shared/lib/utils";
import { TagsList } from "@/widgets/tags";
import { QuestionCard } from "@/widgets/question-card";
import { testQuestion } from "@/pages/qa/model/mocks";
import { TabsLine } from "@/widgets/tabs";

const QAPage = () => {
  return (

    <div className={cn(
      "px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]",
    )}>
      <h1 className="text-[26px] leading-[32px] font-bold mb-4 md:hidden">Q&A</h1>
      <TabsLine />
      <TagsList />
      {[testQuestion].map((question) => <QuestionCard question={question} key={question.id}/>)}
    </div>
  )
}

export const Component = QAPage;