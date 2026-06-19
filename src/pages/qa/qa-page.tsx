import { Search } from "@/widgets/search";
import { TagsList } from "@/widgets/tags";
import { QuestionCard } from "@/widgets/question-card";
import { testQuestion } from "@/pages/qa/model/mocks";
import { PageContainer } from "@/shared/ui/page-container";

const QAPage = () => {
  return (
    <PageContainer className="py-8">
      <Search />

      <div>
        <TagsList />
        {[testQuestion].map((question) => <QuestionCard question={question} key={question.id} />)}
      </div>
    </PageContainer>
  )
}

export const Component = QAPage;
