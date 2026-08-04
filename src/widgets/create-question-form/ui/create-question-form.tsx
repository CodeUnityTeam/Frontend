import { useId, useRef, type FormEvent } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

import { uploadQuestionFile } from "@/entities/question";
import { useSafeGoBack } from "@/shared/lib/hooks";
import { ROUTES } from "@/shared/model/routes";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { MarkdownAttachmentComposer } from "@/shared/ui/markdown-attachment-composer";
import { Textarea } from "@/shared/ui/textarea";

import { useCreateQuestion } from "../model/use-create-question";
import { TagsSelect } from "./tags-select";

type CreateQuestionFormProps = {
  className?: string;
  onSubmit: (values: {
    title: string;
    details: string;
    tags: string[];
    anonymous: boolean;
  }) => void;
  isSubmitting?: boolean;
};

export function CreateQuestionForm({
  className,
  onSubmit,
  isSubmitting = false,
}: CreateQuestionFormProps) {
  const anonymousId = useId();
  const goBack = useSafeGoBack({ fallbackTo: ROUTES.QA });
  const {
    title,
    setTitle,
    details,
    setDetails,
    toggleTag,
    isTagSelected,
    anonymous,
    setAnonymous,
    getValues,
  } = useCreateQuestion();
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(getValues());
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
          className="rounded-lg [&>textarea]:min-h-28.25 [&>textarea]:min-w-0 [&>textarea]:overflow-hidden md:[&>textarea]:min-h-21.5"
        />

        <MarkdownAttachmentComposer
          ref={editorRef}
          label="Раскройте суть вопроса"
          description="Поддерживаются списки, таблицы, цитаты, код и изображения."
          markdown={details}
          onChange={setDetails}
          imageUploadHandler={uploadQuestionFile}
          placeholder="Опишите детали вашего вопроса, Вы можете использовать изображения, ссылки, списки, Ctrl-V/Ctrl-C для вставки текста и изображений."
          editorClassName="rounded-lg"
          contentEditableClassName="min-h-[180px]"
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
          disabled={isSubmitting}
          onClick={goBack}
        >
          Отменить
        </Button>
        <Button
          type="submit"
          className="min-w-0 flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Публикация..." : "Опубликовать"}
        </Button>
      </div>
    </form>
  );
}
