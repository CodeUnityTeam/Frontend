import type { FormEvent } from "react";

import type { QuestionFormValues } from "@/entities/question";
import { uploadQuestionFile } from "@/entities/question";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";

import { useQuestionForm } from "../model/use-question-form";
import { TagsSelect } from "./tags-select";

type QuestionFormProps = {
  initialValues: QuestionFormValues;
  onSubmit: (values: QuestionFormValues) => void;
  onDelete: () => void;
  className?: string;
  isSubmitting?: boolean;
};

export function QuestionForm({
  initialValues,
  onSubmit,
  onDelete,
  className,
  isSubmitting = false,
}: QuestionFormProps) {
  const {
    title,
    setTitle,
    details,
    setDetails,
    selectedTags,
    toggleTag,
    isTagSelected,
    getValues,
  } = useQuestionForm(initialValues);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(getValues());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-5 rounded-[20px] border border-input px-3 py-8 md:gap-10 md:px-8 md:py-15",
        className,
      )}
    >
      <div className="flex flex-col gap-5 md:gap-7">
        <Textarea
          label="Заголовок вопроса"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-2xl border-foreground [&>textarea]:min-h-[113px] [&>textarea]:min-w-0 [&>textarea]:overflow-auto md:[&>textarea]:min-h-[86px]"
        />

        <MarkdownEditor
          label="Суть вопроса"
          description="Поддерживаются Markdown и изображения."
          markdown={details}
          onChange={setDetails}
          imageUploadHandler={uploadQuestionFile}
          editorClassName="rounded-2xl"
          contentEditableClassName="min-h-[320px] md:min-h-[420px]"
        />

        <TagsSelect
          selectedTags={selectedTags}
          onToggle={toggleTag}
          isSelected={isTagSelected}
        />
      </div>

      <div className="flex w-full items-center gap-5">
        <Button
          type="button"
          variant="outline"
          className="min-w-0 flex-1"
          disabled={isSubmitting}
          onClick={onDelete}
        >
          Удалить
        </Button>
        <Button type="submit" className="min-w-0 flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
