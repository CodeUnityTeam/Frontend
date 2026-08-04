import { Icon } from "@iconify/react";
import { generatePath, useNavigate } from "react-router";

import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";
import { Tag } from "@/shared/ui/tag";
import { MarkdownViewer } from "@/shared/ui/markdown-viewer";
import { useQuestionCommentCount } from "@/shared/store/question-comments-store";
import { QuestionLikeButton } from "@/entities/question";
import type { QuestionCardProps } from "../model/types";

import { useIsAuthed } from "@/shared/lib/auth";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";

export function QuestionCard({ question }: QuestionCardProps) {
  const navigate = useNavigate();
  const isAuthed = useIsAuthed();
  const { openModal, setRedirectPath } = useAuthModalStore();
  const pendingCommentCount = useQuestionCommentCount(question.id);
  const detailHref = generatePath(ROUTES.QA_DETAILS, {
    id: question.id,
  });
  const answerHref = `${detailHref}#question-answer-form`;
  const visibleCommentCount = question.comments + pendingCommentCount;
  const avatarSrc = question.user.avatarUrl || undefined;

  const openQuestion = (href: string) => {
    if (!isAuthed) {
      setRedirectPath(href);
      openModal();
      return;
    }

    navigate(href);
  };

  return (
    <Card className="h-fit border-muted-foreground">
      <CardHeader className="flex flex-row justify-between items-start gap-4 p-6 pb-3">
        <div className="flex flex-col gap-y-3 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar>
                <AvatarImage src={avatarSrc} alt={question.user.firstName} />
                <AvatarFallback className="bg-transparent p-0">
                  <img
                    src={AvatarPlaceholder}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
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
        <MarkdownViewer
          markdown={question.description}
          className="max-h-24 overflow-hidden text-lg text-foreground"
          imageVariant="thumbnail"
        />
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4 p-6 pt-0">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <QuestionLikeButton
            questionId={question.id}
            likesCount={question.likes}
            isLikedByMe={question.isLikedByMe}
          />

          <div className="flex items-center gap-2">
            <Icon icon="ph:chat-teardrop-dots" className="size-6" />
            <span>{visibleCommentCount}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="ghost" 
            onClick={() => openQuestion(answerHref)}
            className="font-semibold"
          >
              <Icon icon="ph:arrow-bend-down-right" className="size-5" />
              <span>Ответить</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => openQuestion(detailHref)}
            className="font-semibold"
          >
            Подробнее
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}