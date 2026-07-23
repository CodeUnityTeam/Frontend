import type { QuestionsFilter } from "@/entities/question/model/types";

export type QaTab = "new" | "popular" | "unanswered" | "my-questions";
export type QaUnansweredSort = "date" | "likes";

export const TAB_TO_FILTER: Record<QaTab, QuestionsFilter | undefined> = {
  new: undefined,
  popular: "popular",
  unanswered: "no_answers",
  "my-questions": "my",
};
