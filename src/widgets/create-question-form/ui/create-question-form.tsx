import { useId, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Textarea } from "@/shared/ui/textarea";

import { useCreateQuestion } from "../model/use-create-question";
import { TagsSelect } from "./tags-select";

type CreateQuestionFormProps = {
  className?: string;
};

/**
 * Карточка-форма создания вопроса (раздел Q&A): заголовок, суть вопроса,
 * выбор тегов, опция анонимной публикации и кнопки действий.
 */
export function CreateQuestionForm({ className }: CreateQuestionFormProps) {
  const navigate = useNavigate();
  const anonymousId = useId();
  const {
    title,
    setTitle,
    details,
    setDetails,
    toggleTag,
    isTagSelected,
    anonymous,
    setAnonymous,
  } = useCreateQuestion();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: отправка вопроса на бэкенд (axios + TanStack Query)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-6 rounded-xl border border-input px-3 py-8 md:gap-10 md:px-8 md:py-15",
        className,
      )}
    >
      <div className="flex flex-col gap-7">
        <Textarea
          label="Придумайте заголовок"
          placeholder="Как собрать портфолио, если нет коммерческого опыта, но хочется попасть в реальные проекты?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-lg [&>textarea]:min-w-0 [&>textarea]:overflow-hidden [&>textarea]:min-h-[113px] md:[&>textarea]:min-h-[86px]"
        />

        <Textarea
          label="Раскройте суть вопроса"
          placeholder="Опишите детали вашего вопроса"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          rows={1}
          className="rounded-lg [&>textarea]:min-w-0 [&>textarea]:overflow-hidden [&>textarea]:min-h-[59px]"
        />

        <TagsSelect onToggle={toggleTag} isSelected={isTagSelected} />
      </div>

      <label
        htmlFor={anonymousId}
        className="flex h-7 cursor-pointer items-center gap-2"
      >
        <Checkbox
          id={anonymousId}
          checked={anonymous}
          onCheckedChange={(value) => setAnonymous(value === true)}
        />
        <span className="text-[18px] text-foreground">
          Опубликовать анонимно
        </span>
      </label>

      <div className="flex w-full items-center gap-5">
        <Button
          type="button"
          variant="outline"
          className="min-w-0 flex-1"
          onClick={() => navigate(-1)}
        >
          Отменить
        </Button>
        <Button type="submit" className="min-w-0 flex-1">
          Опубликовать
        </Button>
      </div>
    </form>
  );
}
