import type { FormEvent, Ref } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

import { useUploadQuestionFile } from "@/entities/question";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";

type QuestionAnswerFormProps = {
  title: string;
  description: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  className?: string;
  id?: string;
  editorRef?: Ref<MDXEditorMethods>;
};

export function QuestionAnswerForm({
  title,
  description,
  label,
  value,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Отправить",
  onCancel,
  cancelLabel = "Отмена",
  className,
  id,
  editorRef,
}: QuestionAnswerFormProps) {
  const { mutateAsync: uploadFile } = useUploadQuestionFile();

  return (
    <Card
      id={id}
      className={cn(
        "rounded-2xl border-none bg-transparent shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-2 p-6 pb-0">
        <CardTitle className="text-[24px] leading-[1.2] font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <MarkdownEditor
            ref={editorRef}
            label={label}
            description={description}
            markdown={value}
            onChange={onChange}
            imageUploadHandler={uploadFile}
            placeholder="Начните вводить Markdown..."
            contentEditableClassName="min-h-[200px]"
          />

          <div className="flex flex-wrap justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="min-w-[140px]"
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !value.trim()}
              className="min-w-[180px]"
            >
              {isSubmitting ? "Отправка..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
