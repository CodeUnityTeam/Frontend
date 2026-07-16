import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router";

import AvatarPlaceholder from "@/shared/assets/images/avatar-placeholder.svg";
import { formatRelativeDate } from "@/shared/lib/pluralize";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/button";
import { MarkdownViewer } from "@/shared/ui/markdown-viewer";
import type { QuestionData } from "@/widgets/question-card";

type MyQuestionsCardProps = {
  question: QuestionData;
  editHref: string;
  onDelete?: () => void;
  isDeleting?: boolean;
};

export function MyQuestionsCard({
  question,
  editHref,
  onDelete,
  isDeleting = false,
}: MyQuestionsCardProps) {
  const detailHref = generatePath(ROUTES.QA_DETAILS, {
    id: question.id,
  });
  const avatarSrc = question.user.avatarUrl || AvatarPlaceholder;

  return (
    <article className="mt-5 w-full max-w-[955px] rounded-[var(--radius-lg)] border border-1 border-[var(--color-gray)] bg-[var(--color-white)] px-8 py-9">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={avatarSrc}
            alt={question.user.firstName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-3">
            <span className="text-[20px] font-semibold text-[var(--color-black)]">
              {question.user.firstName}
            </span>
            <div className="flex items-center gap-1 text-[var(--color-black)]">
              <Icon icon="ph:thumbs-up" className="h-5 w-5" />
              <span className="text-[18px]">{question.user.rating}</span>
            </div>
          </div>
        </div>

        <span className="pt-3 pb-3 text-[14px] text-[var(--color-black)]">
          {formatRelativeDate(question.createdAt)}
        </span>
      </div>

      <h2 className="mt-3 text-[26px] font-bold text-[var(--color-black)]">
        {question.title}
      </h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {question.skills.map((tag) => (
          <span
            key={tag}
            className="rounded-[var(--radius-lg)] border border-1 border-[var(--color-gray)] px-3 py-1 text-[18px] text-[var(--color-black)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <MarkdownViewer
        markdown={question.description}
        className="mt-7 text-[18px] font-normal text-[var(--color-black)]"
        imageVariant="thumbnail"
      />

      <div className="mt-7 flex flex-wrap justify-end gap-3">
        <Button asChild variant="ghost" className="font-[18px] font-semibold">
          <Link to={`${detailHref}#question-answer-form`}>
            <Icon icon="ph:arrow-bend-down-right" className="h-5 w-5" />
            <span>Ответить</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" className="font-[18px] font-semibold">
          <Link to={detailHref}>Подробнее</Link>
        </Button>
        <Button asChild variant="outline" className="font-[18px] font-semibold">
          <Link to={editHref}>Редактировать</Link>
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            className="font-[18px] font-semibold"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </Button>
        )}
      </div>
    </article>
  );
}
