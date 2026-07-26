import type { QuestionAnswerDto } from "@/entities/question";

export type AnswerSortMode = "date" | "likes";

export type QuestionAnswerNode = QuestionAnswerDto & {
  replies: QuestionAnswerNode[];
};
