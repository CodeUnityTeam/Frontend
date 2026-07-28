import { Icon } from "@iconify/react";
import { Link } from "react-router";

import type { QuestionDetailDto } from "@/entities/question";
import { QuestionLikeButton } from "@/entities/question";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { MarkdownViewer } from "@/shared/ui/markdown-viewer";
import { Tag } from "@/shared/ui/tag";

type QuestionDetailsCardProps = {
  question: QuestionDetailDto;
  answerCount: number;
  answerFormHref: string;
  className?: string;
};

export function QuestionDetailsCard({
  question,
  answerCount,
  answerFormHref,
  className,
}: QuestionDetailsCardProps) {
  return (
    <Card className={cn("rounded-2xl border-none bg-transparent shadow-none", className)}>
      <CardContent className="flex flex-col gap-6 !p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] leading-[1.2] font-bold tracking-normal">
              {question.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Tag
                  key={tag}
                  variant="outline"
                  className="text-[18px] leading-[150%] font-normal tracking-normal"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <MarkdownViewer
          markdown={question.description}
          className="max-w-4xl text-[18px] leading-[1.4] font-medium text-foreground"
        />

        {question.images.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.images.map((src) => (
              <img
                key={src}
                src={src}
                alt={question.title}
                className="max-h-[320px] w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-6 px-6 pt-0 pb-6 text-muted-foreground">
        <QuestionLikeButton
          questionId={question.question_id}
          likesCount={question.likes_count}
          isLikedByMe={question.is_liked_by_me}
        />
        <Button
          asChild
          variant="ghost"
          className="gap-2 px-3 font-medium text-muted-foreground hover:text-primary"
        >
          <Link to={answerFormHref}>
            <Icon icon="ph:arrow-bend-down-right" className="size-5" />
            <span>Ответить</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Icon icon="ph:chat-teardrop-dots" className="size-6" />
          <span>{answerCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
