import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

import type { QuestionAnswerDto } from "@/entities/question";
import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardContent } from "@/shared/ui/card";
import { MarkdownViewer } from "@/shared/ui/markdown-viewer";

type QuestionAnswerCardProps = {
  answer: QuestionAnswerDto;
  depth?: number;
  className?: string;
  children?: ReactNode;
};

export function QuestionAnswerCard({
  answer,
  depth = 0,
  className,
  children,
}: QuestionAnswerCardProps) {
  const images = answer.images ?? [];
  const avatarSrc = answer.author_avatar || undefined;

  return (
    <Card className={cn("rounded-2xl border-none bg-transparent shadow-none", className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Avatar className={cn("shrink-0", depth > 0 ? "size-11" : "size-12")}>
              <AvatarImage src={avatarSrc} alt={answer.author_name} />
              <AvatarFallback className="bg-transparent p-0">
                <img
                  src={AvatarPlaceholder}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "font-semibold text-foreground",
                    depth > 0 ? "text-lg" : "text-xl",
                  )}
                >
                  {answer.author_name}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon icon="ph:thumbs-up" className="size-5" />
                  <span className={cn(depth > 0 ? "text-base" : "text-lg")}>
                    {answer.author_rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatRelativeDate(answer.created_at)}
          </span>
        </div>

        <MarkdownViewer
          markdown={answer.content}
          className={cn(
            "mt-4 text-foreground",
            depth > 0 ? "text-base leading-7" : "text-lg leading-7",
          )}
        />

        {images.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {images.map((src) => (
              <img
                key={src}
                src={src}
                alt={answer.author_name}
                className="max-h-80 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
