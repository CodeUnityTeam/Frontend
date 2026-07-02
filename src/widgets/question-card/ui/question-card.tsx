import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router";
import AvatarPlaceholder from "@/shared/assets/images/avatar.png";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/card";
import { Tag } from "@/shared/ui/tag";
import { ROUTES } from "@/shared/model/routes";
import { useQuestionCommentCount } from "@/shared/store/question-comments-store";
import { QuestionLikeButton } from "@/entities/question";
import type { QuestionCardProps } from "../model/types";

export function QuestionCard({
  question,
  }: QuestionCardProps) {
  const pendingCommentCount = useQuestionCommentCount(question.question_id);
  const detailHref = generatePath(ROUTES.QA_DETAILS, {
    id: question.question_id,
  });
  const visibleCommentCount = question.answers_count + pendingCommentCount;

  return (
    <Card className="h-fit border-muted-foreground">
      <CardHeader className="flex flex-row justify-between items-start gap-4 p-6 pb-3">
        <div className="flex flex-col gap-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={AvatarPlaceholder} alt={question.author_name} />
                <AvatarFallback>
                  <Icon icon="ph:user" className="size-6" />
                </AvatarFallback>
              </Avatar>
              <span className="text-xl font-semibold">{question.author_name}</span>
              <div className="flex flex-row items-center gap-1">
                <Icon icon={"ph:thumbs-up"} className="size-6" />
                <span className="text-lg align-middle">{question.author_rating}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatRelativeDate(question.created_at)}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold leading-8">
            {question.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((skill) => (
              <Tag variant="outline" key={skill}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <CardDescription className="text-lg text-foreground line-clamp-2">
          {question.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex flex-wrap items-center justify-between gap-4 p-6 pt-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <QuestionLikeButton
            questionId={question.question_id}
            likesCount={question.likes_count}
          />

          <div className="flex items-center gap-2">
            <Icon icon="ph:chat-teardrop-dots" className="size-6" />
            <span>{visibleCommentCount}</span>
          </div>
        </div>

        <Button asChild variant="ghost" className="font-semibold">
          <Link to={detailHref}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
};
