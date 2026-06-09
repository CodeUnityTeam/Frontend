import type { questionTags } from "./question-tags";

export type QuestionTag = (typeof questionTags)[number]["value"];

export type Question = {
  id: string;
  title: string;
  details: string;
  tags: QuestionTag[];
};

export type QuestionFormValues = {
  title: string;
  details: string;
  tags: QuestionTag[];
};
