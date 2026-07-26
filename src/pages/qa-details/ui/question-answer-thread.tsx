import { Icon } from "@iconify/react";
import type { FormEvent } from "react";

import { AnswerLikeButton } from "@/entities/question";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import type { QuestionAnswerNode } from "../model/types";
import { QuestionAnswerCard } from "./question-answer-card";
import { QuestionAnswerForm } from "./question-answer-form";

type QuestionAnswerThreadProps = {
  answer: QuestionAnswerNode;
  depth?: number;
  showReplies: boolean;
  replyToAnswerId: string | null;
  replyAnswerContent: string;
  isReplySubmitting: boolean;
  onToggleReply: (answerId: string) => void;
  onReplyChange: (value: string) => void;
  onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteRequest: (answer: QuestionAnswerNode) => void;
};

export function QuestionAnswerThread({
  answer,
  depth = 0,
  showReplies,
  replyToAnswerId,
  replyAnswerContent,
  isReplySubmitting,
  onToggleReply,
  onReplyChange,
  onReplySubmit,
  onDeleteRequest,
}: QuestionAnswerThreadProps) {
  const isReplyOpen = replyToAnswerId === answer.answer_id;

  return (
    <div className={cn(depth > 0 && "pl-5 sm:pl-8")}>
      <QuestionAnswerCard answer={answer} depth={depth}>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <AnswerLikeButton
            answerId={answer.answer_id}
            likesCount={answer.likes_count}
            isLikedByMe={answer.is_liked_by_me}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleReply(answer.answer_id)}
            className="gap-2 px-3 font-medium text-muted-foreground hover:text-primary"
          >
            <Icon icon="ph:arrow-bend-down-right" className="size-5" />
            <span>{isReplyOpen ? "Скрыть ответ" : "Ответить"}</span>
          </Button>

          {answer.is_owned_by_me && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDeleteRequest(answer)}
              className="gap-2 px-3 font-medium text-destructive hover:text-destructive"
            >
              <Icon icon="ph:trash" className="size-5" />
              <span>Удалить</span>
            </Button>
          )}
        </div>

        {isReplyOpen && (
          <QuestionAnswerForm
            title="Ответить"
            description="Ответ будет добавлен в эту ветку."
            label="Ответ"
            value={replyAnswerContent}
            onChange={onReplyChange}
            onSubmit={onReplySubmit}
            onCancel={() => onToggleReply(answer.answer_id)}
            cancelLabel="Отменить"
            submitLabel="Отправить ответ"
            isSubmitting={isReplySubmitting}
            className="bg-transparent"
          />
        )}
      </QuestionAnswerCard>

      {showReplies && answer.replies.length > 0 && (
        <div className="mt-4 space-y-4 pl-4 sm:pl-6">
          {answer.replies.map((reply) => (
            <QuestionAnswerThread
              key={reply.answer_id}
              answer={reply}
              depth={depth + 1}
              showReplies={showReplies}
              replyToAnswerId={replyToAnswerId}
              replyAnswerContent={replyAnswerContent}
              isReplySubmitting={isReplySubmitting}
              onToggleReply={onToggleReply}
              onReplyChange={onReplyChange}
              onReplySubmit={onReplySubmit}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
