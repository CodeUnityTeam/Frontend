import { cn } from "@/shared/lib/utils";
import { TagsList } from "@/widgets/tags";
import { QuestionCard } from "@/widgets/question-card";
import { testQuestion } from "@/pages/qa/model/mocks";

const QAPage = () => {
  return (
    <div className={cn(
      "px-[clamp(1rem,calc(1rem+(100vw-20rem)*64/1120),5rem)]",
    )}>
      <TagsList />
      {[testQuestion].map((question) => <QuestionCard question={question} key={question.id}/>)}
    </div>
  )
}

export const Component = QAPage;