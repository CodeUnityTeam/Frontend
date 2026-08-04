import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react";
import type {
  ChangeEvent,
  ClipboardEvent,
  ComponentPropsWithoutRef,
  DragEvent,
} from "react";

import { cn } from "@/shared/lib/utils";
import {
  useFileUploadQueue,
  type FileUploadQueueItem,
  type FileUploadStatus,
} from "@/shared/lib/use-file-upload-queue";
import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/ui/field";
import { TextareaBasic } from "@/shared/ui/textarea/textarea-basic";

export type MarkdownAttachment = {
  id: string;
  url?: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  status: FileUploadStatus;
  errorMessage?: string;
};

type MarkdownImageUploadResult =
  | string
  | {
      imageUrl: string;
      originalName?: string;
      fileSize?: number;
      mimeType?: string;
    };

type NormalizedMarkdownImageUploadResult = {
  url: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
};

export type MarkdownImageFieldProps = Omit<
  ComponentPropsWithoutRef<typeof TextareaBasic>,
  "value" | "defaultValue" | "onChange"
> & {
  markdown: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: (
    image: File,
  ) => Promise<MarkdownImageUploadResult> | MarkdownImageUploadResult;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  textareaClassName?: string;
  maxFileSizeBytes?: number;
  maxFilesPerBatch?: number;
  collapsible?: boolean;
  onAttachmentsChange?: (attachments: MarkdownAttachment[]) => void;
  hideTextarea?: boolean;
  onInsertAttachment?: (attachment: MarkdownAttachment) => void;
  onInsertAllAttachments?: (attachments: MarkdownAttachment[]) => void;
};

type MarkdownImageUploadSummary = {
  total: number;
  uploading: number;
  success: number;
  failed: number;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 16 * 1024 * 1024;

function normalizeImageUploadResult(
  result: Promise<MarkdownImageUploadResult> | MarkdownImageUploadResult,
  file: File,
): Promise<NormalizedMarkdownImageUploadResult> {
  return Promise.resolve(result).then((resolved) =>
    typeof resolved === "string"
      ? {
          url: resolved,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }
      : {
          url: resolved.imageUrl,
          originalName: resolved.originalName ?? file.name,
          fileSize: resolved.fileSize ?? file.size,
          mimeType: resolved.mimeType ?? file.type,
        },
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

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function validateImageFile(
  file: File,
  maxFileSizeBytes: number,
): string | null {
  if (file.size <= 0) {
    return `Файл «${file.name}» пустой.`;
  }

  if (!isImageFile(file)) {
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

function collectFilesFromDrop(dataTransfer: DataTransfer | null) {
  return collectFilesFromList(dataTransfer?.files);
}

function summarizeUploads(
  items: Array<FileUploadQueueItem<unknown>>,
): MarkdownImageUploadSummary {
  return {
    total: items.length,
    uploading: items.filter((item) => item.status === "uploading").length,
    success: items.filter((item) => item.status === "success").length,
    failed: items.filter((item) => item.status === "failed").length,
  };
}

function statusLabel(status: FileUploadStatus) {
  switch (status) {
    case "uploading":
      return "Загрузка";
    case "success":
      return "Готово";
    case "failed":
      return "Ошибка";
    case "idle":
    default:
      return "Ожидание";
  }
}

function statusBadgeClassName(status: FileUploadStatus) {
  switch (status) {
    case "uploading":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "failed":
      return "border-destructive/20 bg-destructive/5 text-destructive";
    case "idle":
    default:
      return "border-input bg-background text-muted-foreground";
  }
}

function progressBarClassName(status: FileUploadStatus) {
  switch (status) {
    case "uploading":
      return "w-2/3 animate-pulse bg-primary";
    case "success":
      return "w-full bg-emerald-500";
    case "failed":
      return "w-full bg-destructive";
    case "idle":
    default:
      return "w-0 bg-transparent";
  }
}

export const MarkdownImageField = forwardRef<
  HTMLTextAreaElement,
  MarkdownImageFieldProps
>(function MarkdownImageField(
  {
    markdown,
    onChange,
    imageUploadHandler,
    label,
    description,
    error,
    className,
    textareaClassName,
    maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
    maxFilesPerBatch = 5,
    collapsible = false,
    onAttachmentsChange,
    hideTextarea = false,
    onInsertAttachment: onExternalInsertAttachment,
    onInsertAllAttachments: onExternalInsertAllAttachments,
    placeholder = "Вы можете использовать изображения, ссылки, списки, Ctrl-V/Ctrl-C для вставки текста и изображений.",
    disabled = false,
    spellCheck = true,
    autoFocus,
    rows,
    ...textareaProps
  },
  ref,
) {
  const generatedId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const markdownRef = useRef(markdown);
  const dragDepthRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(!collapsible);
  const [shouldAutoHide, setShouldAutoHide] = useState(false);

  useEffect(() => {
    markdownRef.current = markdown;
  }, [markdown]);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const insertAttachment = (
    item: FileUploadQueueItem<NormalizedMarkdownImageUploadResult>,
  ) => {
    if (!item.response?.url || !textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imageMarkdown = `![${getAltText(item.file)}](${item.response.url})`;
    const nextMarkdown = `${markdown.slice(0, start)}${imageMarkdown}${markdown.slice(end)}`;
    const nextCursor = start + imageMarkdown.length;

    markdownRef.current = nextMarkdown;
    onChange(nextMarkdown);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const insertAllAttachments = () => {
    const attachments = uploadQueue.items.filter(
      (item) => item.status === "success" && item.response?.url,
    );

    if (attachments.length === 0) {
      return;
    }

    const mappedAttachments = attachments.map(
      (item) =>
        ({
          id: item.id,
          url: item.response?.url,
          originalName: item.response?.originalName ?? item.file.name,
          fileSize: item.response?.fileSize ?? item.file.size,
          mimeType: item.response?.mimeType ?? item.file.type,
          status: item.status,
        }) satisfies MarkdownAttachment,
    );

    if (onExternalInsertAllAttachments) {
      onExternalInsertAllAttachments(mappedAttachments);
      return;
    }

    if (!textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imagesMarkdown = attachments
      .map((item) => `![${getAltText(item.file)}](${item.response?.url})`)
      .join("\n\n");
    const nextMarkdown = `${markdown.slice(0, start)}${imagesMarkdown}${markdown.slice(end)}`;
    const nextCursor = start + imagesMarkdown.length;

    markdownRef.current = nextMarkdown;
    onChange(nextMarkdown);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const clearUploads = () => {
    uploadQueue.clearQueue();
    setTopError(null);
    setShouldAutoHide(false);
    setIsUploaderOpen(false);
  };

  const uploadQueue = useFileUploadQueue({
    uploadFile: (file) =>
      normalizeImageUploadResult(imageUploadHandler(file), file),
    validateFile: (file) => validateImageFile(file, maxFileSizeBytes),
    onFailure: (_item, errorMessage) => {
      setTopError(errorMessage);
    },
  });

  const uploadSummary = useMemo(
    () => summarizeUploads(uploadQueue.items),
    [uploadQueue.items],
  );

  useEffect(() => {
    onAttachmentsChange?.(
      uploadQueue.items.map((item) => ({
        id: item.id,
        url: item.response?.url,
        originalName: item.response?.originalName ?? item.file.name,
        fileSize: item.response?.fileSize ?? item.file.size,
        mimeType: item.response?.mimeType ?? item.file.type,
        status: item.status,
        errorMessage: item.errorMessage,
      })),
    );
  }, [onAttachmentsChange, uploadQueue.items]);

  useEffect(() => {
    if (
      !collapsible ||
      !shouldAutoHide ||
      uploadSummary.total === 0 ||
      uploadSummary.uploading > 0 ||
      uploadSummary.failed > 0 ||
      uploadSummary.success !== uploadSummary.total
    ) {
      return;
    }

    setIsUploaderOpen(false);
    setShouldAutoHide(false);
  }, [collapsible, shouldAutoHide, uploadSummary]);

  const openFilePicker = () => {
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFiles = (files: File[]) => {
    if (disabled || files.length === 0) {
      return;
    }

    setTopError(null);
    setIsUploaderOpen(true);
    setShouldAutoHide(true);

    if (files.length > maxFilesPerBatch) {
      setTopError(
        `Можно загрузить не более ${maxFilesPerBatch} изображений за раз.`,
      );
    }

    uploadQueue.enqueueFiles(files.slice(0, maxFilesPerBatch));
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(collectFilesFromList(event.target.files));
    event.target.value = "";
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
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

    const files = collectFilesFromDrop(event.dataTransfer);
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

    const files = collectFilesFromDrop(event.dataTransfer);
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

    const files = collectFilesFromDrop(event.dataTransfer);
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

    const files = collectFilesFromDrop(event.dataTransfer);
    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    handleFiles(files);
  };

  const stateSummary =
    uploadSummary.total === 0
      ? "откройте загрузку файлов, чтобы добавить изображения, или вставьте их из буфера обмена прямо в редакторе."
      : uploadSummary.uploading > 0
        ? `${uploadSummary.uploading} в процессе`
        : uploadSummary.failed > 0
          ? `${uploadSummary.failed} с ошибкой`
          : ``;

  return (
    <Field className={cn("gap-2", className)} data-disabled={disabled}>
      {label && <FieldLabel htmlFor={generatedId}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}

      <FieldContent className="gap-3">
        {collapsible && (
          <button
            type="button"
            className="flex items-center justify-between gap-3 rounded-xl border border-input bg-background px-4 py-3 text-left text-sm font-medium text-foreground"
            aria-expanded={isUploaderOpen}
            onClick={() => setIsUploaderOpen((open) => !open)}
          >
            <span>Добавить изображения</span>
            <span className="text-xs text-muted-foreground">
              {isUploaderOpen ? "Скрыть" : "Открыть"}
            </span>
          </button>
        )}

        {(!collapsible || isUploaderOpen) && (
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
                isDragging && "border-primary",
                disabled && "cursor-not-allowed opacity-60",
              )}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={openFilePicker}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div
                style={{
                  backgroundColor: isDragging
                    ? "rgba(59, 130, 246, 0.05)"
                    : "transparent",
                  opacity: isDragging ? 1 : 0,
                }}
                className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity"
                aria-hidden="true"
              ></div>

              <div
                className="relative flex size-14 items-center justify-center rounded-full border border-dashed border-border bg-muted text-foreground transition-colors"
                aria-hidden="true"
              >
                <Icon icon="ph:upload-simple" className="size-7" />
              </div>

              <div className="mt-5 max-w-xl space-y-2">
                <div className="text-[18px] leading-[1.35] font-semibold text-foreground sm:text-[20px]">
                  Перетащите изображения сюда или нажмите, чтобы выбрать файлы
                </div>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  Поддерживаются изображения до{" "}
                  {formatFileSize(maxFileSizeBytes)}. Можно вставлять скриншоты
                  из буфера обмена и загружать несколько файлов сразу.
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
                disabled={uploadSummary.success === 0}
                onClick={insertAllAttachments}
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

                          {item.status === "success" && item.response?.url ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="shrink-0 px-2.5 text-xs"
                              title="Вставить в редактор"
                              aria-label="Вставить в редактор"
                              onClick={() => {
                                const response = item.response;
                                if (!response) return;
                                const attachment = {
                                  id: item.id,
                                  url: response.url,
                                  originalName:
                                    response.originalName ?? item.file.name,
                                  fileSize: response.fileSize ?? item.file.size,
                                  mimeType: response.mimeType ?? item.file.type,
                                  status: item.status,
                                } satisfies MarkdownAttachment;
                                if (onExternalInsertAttachment) {
                                  onExternalInsertAttachment(attachment);
                                } else {
                                  insertAttachment(item);
                                }
                              }}
                            >
                              Вставить
                            </Button>
                          ) : (
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                                statusBadgeClassName(item.status),
                              )}
                            >
                              {statusLabel(item.status)}
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
                              progressBarClassName(item.status),
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
          </>
        )}

        {!hideTextarea ? (
          <TextareaBasic
            id={generatedId}
            value={markdown}
            ref={textareaRef}
            onChange={(event) => {
              markdownRef.current = event.target.value;
              onChange(event.target.value);
            }}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled}
            spellCheck={spellCheck}
            autoFocus={autoFocus}
            rows={rows}
            className={cn(
              "min-h-55 rounded-2xl border border-input bg-background px-4 py-4 text-base leading-7 text-foreground shadow-sm transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              textareaClassName,
            )}
            {...textareaProps}
          />
        ) : null}

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{stateSummary}</span>
        </div>

        {(topError || error) && <FieldError>{topError || error}</FieldError>}
      </FieldContent>
    </Field>
  );
});
