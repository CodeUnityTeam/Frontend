import { Icon } from "@iconify/react";
import type { FormEvent } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import type { AnswerSortMode, QuestionAnswerNode } from "../model/types";
import { QuestionAnswerThread } from "./question-answer-thread";

type QuestionAnswersSectionProps = {
  answerCount: number;
  answerThreads: QuestionAnswerNode[];
  answerSortMode: AnswerSortMode;
  onAnswerSortModeChange: (mode: AnswerSortMode) => void;
  showOnlyTopLevelAnswers: boolean;
  onToggleTopLevelAnswers: () => void;
  replyToAnswerId: string | null;
  replyAnswerContent: string;
  isReplySubmitting: boolean;
  onToggleReply: (answerId: string) => void;
  onReplyChange: (value: string) => void;
  onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteRequest: (answer: QuestionAnswerNode) => void;
  className?: string;
};

export function QuestionAnswersSection({
  answerCount,
  answerThreads,
  answerSortMode,
  onAnswerSortModeChange,
  showOnlyTopLevelAnswers,
  onToggleTopLevelAnswers,
  replyToAnswerId,
  replyAnswerContent,
  isReplySubmitting,
  onToggleReply,
  onReplyChange,
  onReplySubmit,
  onDeleteRequest,
  className,
}: QuestionAnswersSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-foreground">Ответы</h2>
          <span className="text-sm text-muted-foreground">{answerCount} шт.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex h-10 min-w-[180px] cursor-pointer items-center justify-between rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-primary">
              <span>{answerSortMode === "date" ? "По дате" : "По лайкам"}</span>
              <Icon
                icon="lucide:chevron-down"
                className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-(--radix-dropdown-menu-trigger-width)"
            >
              <DropdownMenuItem
                onClick={() => onAnswerSortModeChange("date")}
                className="cursor-pointer"
              >
                По дате
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAnswerSortModeChange("likes")}
                className="cursor-pointer"
              >
                По лайкам
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant={showOnlyTopLevelAnswers ? "default" : "outline"}
            onClick={onToggleTopLevelAnswers}
            className="h-10 rounded-xl px-4 text-sm font-medium"
          >
            {showOnlyTopLevelAnswers ? "Только ответы" : "Ответы и обсуждения"}
          </Button>
        </div>
      </div>

      {answerThreads.length > 0 ? (
        answerThreads.map((answer) => (
          <QuestionAnswerThread
            key={answer.answer_id}
            answer={answer}
            showReplies={!showOnlyTopLevelAnswers}
            replyToAnswerId={replyToAnswerId}
            replyAnswerContent={replyAnswerContent}
            isReplySubmitting={isReplySubmitting}
            onToggleReply={onToggleReply}
            onReplyChange={onReplyChange}
            onReplySubmit={onReplySubmit}
            onDeleteRequest={onDeleteRequest}
          />
        ))
      ) : (
        <Card className="rounded-2xl border-none bg-transparent shadow-none">
          <CardContent className="!p-6 text-muted-foreground">
            Пока нет ответов.
          </CardContent>
        </Card>
      )}
    </section>
  );
}
