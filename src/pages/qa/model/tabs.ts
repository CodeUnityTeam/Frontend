import type { QuestionsFilter } from "@/entities/question/model/types";

export const TAB_TO_FILTER: Record<string, QuestionsFilter | undefined> = {
  new: undefined,
  popular: "popular",
  unanswered: "no_answers",
  "my-questions": "my",
};
