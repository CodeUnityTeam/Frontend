import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type CSSProperties,
  type DragEvent,
  type FormEvent,
} from "react";
import { Icon } from "@iconify/react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { uploadQuestionFile } from "@/entities/question";
import { useSafeGoBack } from "@/shared/lib/hooks";
import { ROUTES } from "@/shared/model/routes";
import { useFileUploadQueue } from "@/shared/lib/use-file-upload-queue";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
import { Textarea } from "@/shared/ui/textarea";

import { useCreateQuestion } from "../model/use-create-question";
import { TagsSelect } from "./tags-select";

type MarkdownImageUploadResult = string | { imageUrl: string };

function normalizeImageUploadResult(
  result: Promise<MarkdownImageUploadResult> | MarkdownImageUploadResult,
): Promise<string> {
  return Promise.resolve(result).then((resolved) =>
    typeof resolved === "string" ? resolved : resolved.imageUrl,
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateImageFile(
  file: File,
  maxFileSizeBytes: number,
): string | null {
  if (file.size <= 0) {
    return `Файл «${file.name}» пустой.`;
  }

  if (!file.type.startsWith("image/")) {
    return `Файл «${file.name}» не является изображением.`;
  }

  if (file.size > maxFileSizeBytes) {
    return `Файл «${file.name}» превышает лимит ${formatFileSize(maxFileSizeBytes)}.`;
  }

  return null;
}

function getAltText(file: File) {
  const baseName = file.name.replace(/\.[^.]+$/, "").trim();
  return baseName.length > 0 ? baseName : "image";
}

function collectFilesFromList(list: FileList | null | undefined) {
  return Array.from(list ?? []);
}

function collectFilesFromClipboard(clipboardData: DataTransfer | null) {
  if (!clipboardData) {
    return [] as File[];
  }

  const files = Array.from(clipboardData.files ?? []);
  if (files.length > 0) {
    return files;
  }

  return Array.from(clipboardData.items ?? [])
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

function getStatusStyle(
  status: "idle" | "uploading" | "success" | "failed",
): CSSProperties {
  switch (status) {
    case "uploading":
      return {
        borderColor: "rgb(254 215 170)",
        backgroundColor: "rgb(255 251 235)",
        color: "rgb(180 83 9)",
      };
    case "success":
      return {
        borderColor: "rgb(167 243 208)",
        backgroundColor: "rgb(236 253 245)",
        color: "rgb(4 120 87)",
      };
    case "failed":
      return {
        borderColor: "rgba(220, 38, 38, 0.2)",
        backgroundColor: "rgba(220, 38, 38, 0.05)",
        color: "rgb(220 38 38)",
      };
    case "idle":
    default:
      return {
        borderColor: "hsl(var(--input))",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--muted-foreground))",
      };
  }
}

function MarkdownUploadDropZone({
  onInsertAttachment,
  disabled = false,
}: {
  onInsertAttachment: (imageUrl: string, altText: string) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const maxFileSizeBytes = 16 * 1024 * 1024;

  const uploadQueue = useFileUploadQueue({
    uploadFile: (file) => normalizeImageUploadResult(uploadQuestionFile(file)),
    validateFile: (file) => validateImageFile(file, maxFileSizeBytes),
    onSuccess: () => undefined,
    onFailure: (_item, errorMessage) => {
      setLocalError(errorMessage);
    },
  });

  const clearUploads = () => {
    uploadQueue.clearQueue();
    setLocalError(null);
    setIsOpen(false);
  };

  const summary = useMemo(
    () => ({
      total: uploadQueue.items.length,
      uploading: uploadQueue.items.filter((item) => item.status === "uploading")
        .length,
      success: uploadQueue.items.filter((item) => item.status === "success")
        .length,
      failed: uploadQueue.items.filter((item) => item.status === "failed")
        .length,
    }),
    [uploadQueue.items],
  );

  const openFilePicker = useCallback(() => {
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  }, [disabled]);

  const handleFiles = useCallback(
    (files: File[]) => {
      if (disabled || files.length === 0) {
        return;
      }

      setLocalError(null);
      uploadQueue.enqueueFiles(files);
    },
    [disabled, uploadQueue],
  );

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(collectFilesFromList(event.target.files));
    event.target.value = "";
  };

  const handlePaste = (event: ClipboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const files = collectFilesFromClipboard(event.clipboardData);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    handleFiles(files);
  };

  const handleDragEnter = (event: DragEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const files = collectFilesFromList(event.dataTransfer.files);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const files = collectFilesFromList(event.dataTransfer.files);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const files = collectFilesFromList(event.dataTransfer.files);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    const files = collectFilesFromList(event.dataTransfer.files);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    handleFiles(files);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-input bg-background p-4 shadow-sm">
      {!isOpen && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          Добавить изображения
        </Button>
      )}
      {isOpen && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            disabled={disabled}
            onChange={handleFileInputChange}
          />

          <button
            type="button"
            className={cn(
              "relative flex min-h-55 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-background px-6 py-7 text-center shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              disabled && "cursor-not-allowed opacity-60",
            )}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={openFilePicker}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity"
              style={{
                backgroundColor: isDragging
                  ? "rgba(59, 130, 246, 0.05)"
                  : "transparent",
                opacity: isDragging ? 1 : 0,
              }}
              aria-hidden="true"
            />

            <div
              className={cn(
                "relative flex size-14 items-center justify-center rounded-full border border-dashed border-border bg-muted transition-colors",
                isDragging && "border-primary",
              )}
              style={{
                color: isDragging
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground))",
              }}
              aria-hidden="true"
            >
              <Icon icon="ph:upload-simple" className="size-7" />
            </div>

            <div className="mt-5 max-w-xl space-y-2">
              <div className="text-[18px] leading-[1.35] font-semibold text-foreground sm:text-[20px]">
                Перетащите изображения сюда или нажмите, чтобы выбрать файлы
              </div>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Поддерживаются изображения до {formatFileSize(maxFileSizeBytes)}
                . Можно вставлять скриншоты из буфера обмена и загружать
                несколько файлов сразу.
              </p>
            </div>
          </button>

          <div
            className="flex flex-wrap items-center gap-2 text-sm"
            aria-live="polite"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={summary.success === 0}
              onClick={() => {
                const imagesMarkdown = uploadQueue.items
                  .filter((item) => item.status === "success" && item.response)
                  .map(
                    (item) => `![${getAltText(item.file)}](${item.response})`,
                  )
                  .join("\n\n");
                if (imagesMarkdown) onInsertAttachment(imagesMarkdown, "");
              }}
            >
              Вставить все
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Закрыть загрузку файлов"
              title="Закрыть и очистить"
              onClick={clearUploads}
            >
              <Icon icon="ph:x" className="size-4" />
            </Button>
          </div>

          {uploadQueue.items.length > 0 && (
            <div className="space-y-3">
              {uploadQueue.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-input bg-background p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-input bg-muted text-muted-foreground">
                      <Icon
                        icon={
                          item.status === "failed"
                            ? "ph:warning-circle"
                            : item.status === "uploading"
                              ? "ph:spinner-gap"
                              : "ph:image-square"
                        }
                        className={cn(
                          "size-6",
                          item.status === "uploading" && "animate-spin",
                        )}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-foreground">
                            {item.file.name}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatFileSize(item.file.size)}
                          </div>
                        </div>

                        {item.status === "success" && item.response ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 px-2.5 text-xs"
                            title="Вставить в редактор"
                            aria-label="Вставить в редактор"
                            onClick={() => {
                              if (item.response) {
                                onInsertAttachment(
                                  item.response,
                                  getAltText(item.file),
                                );
                              }
                            }}
                          >
                            Вставить
                          </Button>
                        ) : (
                          <span
                            className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
                            style={getStatusStyle(item.status)}
                          >
                            {item.status === "uploading"
                              ? "Загрузка"
                              : item.status === "failed"
                                ? "Ошибка"
                                : "Ожидание"}
                          </span>
                        )}
                      </div>

                      {item.errorMessage && (
                        <p className="mt-2 text-sm text-destructive">
                          {item.errorMessage}
                        </p>
                      )}

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.status === "uploading" &&
                              "w-2/3 animate-pulse bg-primary",
                            item.status === "success" &&
                              "w-full bg-emerald-500",
                            item.status === "failed" && "w-full bg-destructive",
                          )}
                        />
                      </div>
                    </div>

                    {item.status === "failed" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shrink-0 px-2.5"
                        onClick={() => uploadQueue.retryItem(item.id)}
                      >
                        Повторить
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {localError && (
            <div className="text-sm text-destructive">{localError}</div>
          )}
        </>
      )}
    </div>
  );
}

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

        <MarkdownUploadDropZone
          onInsertAttachment={(imageUrl, altText) =>
            editorRef.current?.insertMarkdown(
              altText ? `![${altText}](${imageUrl})` : imageUrl,
            )
          }
        />

        <MarkdownEditor
          ref={editorRef}
          label="Раскройте суть вопроса"
          description="Поддерживаются списки, таблицы, цитаты, код и изображения."
          markdown={details}
          onChange={setDetails}
          imageUploadHandler={uploadQuestionFile}
          placeholder="Опишите детали вашего вопроса"
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
