import { Icon } from "@iconify/react";
import { Link } from "react-router";

import type { QuestionDetailDto } from "@/entities/question";
import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

type QuestionDetailsSidebarProps = {
  question: QuestionDetailDto;
  answerCount: number;
  isOwner: boolean;
  editHref: string;
  isDeleting: boolean;
  onDeleteRequest: () => void;
  className?: string;
};

export function QuestionDetailsSidebar({
  question,
  answerCount,
  isOwner,
  editHref,
  isDeleting,
  onDeleteRequest,
  className,
}: QuestionDetailsSidebarProps) {
  return (
    <Card className={cn("h-fit rounded-2xl border-none bg-transparent shadow-none", className)}>
      <CardContent className="!px-5 !py-6">
        <div className="flex items-start gap-3">
          <Avatar className="size-14">
            <AvatarImage
              src={question.author_avatar || undefined}
              alt={question.author_name}
            />
            <AvatarFallback className="bg-transparent p-0">
              <img
                src={AvatarPlaceholder}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="text-lg font-semibold text-foreground">
              {question.author_name}
            </div>

            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <Icon icon="ph:thumbs-up" className="size-5" />
              <span>{question.author_rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div>Опубликовано {formatRelativeDate(question.created_at)}</div>
          <div>Лайков: {question.likes_count}</div>
          <div>Ответов: {answerCount}</div>
        </div>

        {isOwner && (
          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full"
              disabled={isDeleting}
            >
              <Link to={editHref}>Редактировать</Link>
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="h-11 w-full"
              disabled={isDeleting}
              onClick={onDeleteRequest}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
