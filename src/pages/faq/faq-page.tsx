import { QuestionCard } from "@/widgets/question-card";
import { testQuestion } from "./model/question-card-data";

function FaqPage() {
  return (
    <>
      {[testQuestion].map(question => <QuestionCard question={question} />)}
    </>
  )
}

export default FaqPage;

