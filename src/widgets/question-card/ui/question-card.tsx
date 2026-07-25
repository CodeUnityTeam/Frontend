import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router";

import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { Tag } from "@/shared/ui/tag";
import { useQuestionCommentCount } from "@/shared/store/question-comments-store";
import { QuestionLikeButton } from "@/entities/question";
import type { QuestionCardProps } from "../model/types";

export function QuestionCard({ question }: QuestionCardProps) {
  const pendingCommentCount = useQuestionCommentCount(question.id);
  const detailHref = generatePath(ROUTES.QA_DETAILS, {
    id: question.id,
  });
  const answerHref = `${detailHref}#question-answer-form`;
  const visibleCommentCount = question.comments + pendingCommentCount;
  const avatarSrc = question.user.avatarUrl || AvatarPlaceholder;

  return (
    <Card className="h-fit border-muted-foreground">
      <CardHeader className="flex flex-row justify-between items-start gap-4 p-6 pb-3">
        <div className="flex flex-col gap-y-3 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar>
                <AvatarImage src={avatarSrc} alt={question.user.firstName} />
                <AvatarFallback>
                  <Icon icon="ph:user" className="size-6" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xl font-semibold">
                {question.user.firstName}
              </span>
              <div className="flex flex-row items-center gap-1">
                <Icon icon="ph:thumbs-up" className="size-6" />
                <span className="text-lg align-middle">
                  {question.user.rating}
                </span>
              </div>
            </div>
            <div className="whitespace-nowrap text-sm text-muted-foreground">
              {formatRelativeDate(question.createdAt)}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold leading-8">
            {question.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {question.skills.map((skill) => (
              <Tag variant="outline" key={skill}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <CardDescription className="line-clamp-2 text-lg text-foreground">
          {question.description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4 p-6 pt-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <QuestionLikeButton
            questionId={question.id}
            likesCount={question.likes}
          />

          <div className="flex items-center gap-2">
            <Icon icon="ph:chat-teardrop-dots" className="size-6" />
            <span>{visibleCommentCount}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="ghost" className="font-semibold">
            <Link to={answerHref}>
              <Icon icon="ph:arrow-bend-down-right" className="size-5" />
              <span>Ответить</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" className="font-semibold">
            <Link to={detailHref}>Подробнее</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
