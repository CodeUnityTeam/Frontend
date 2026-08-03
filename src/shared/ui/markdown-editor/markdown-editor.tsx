import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { cn } from "@/shared/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldTitle,
} from "@/shared/ui/field";

type MarkdownEditorModule = typeof import("@mdxeditor/editor");
type MarkdownImageUploadResult = string | { imageUrl: string };

let markdownEditorModulePromise: Promise<MarkdownEditorModule> | null = null;

function loadMarkdownEditorModule() {
  markdownEditorModulePromise ??= import("@mdxeditor/editor");
  return markdownEditorModulePromise;
}

type MarkdownEditorProps = {
  markdown: string;
  onChange: (markdown: string) => void;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  contentEditableClassName?: string;
  imageUploadHandler?: (
    image: File,
  ) => Promise<MarkdownImageUploadResult> | MarkdownImageUploadResult;
  autoFocus?: MDXEditorProps["autoFocus"];
  spellCheck?: boolean;
  disabled?: boolean;
};

async function normalizeImageUploadResult(
  result: Promise<MarkdownImageUploadResult> | MarkdownImageUploadResult,
): Promise<string> {
  const resolved = await result;

  if (typeof resolved === "string") {
    return resolved;
  }

  return resolved.imageUrl;
}

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  (
    {
      markdown,
      onChange,
      label,
      description,
      error,
      placeholder = "Начните вводить Markdown...",
      className,
      editorClassName,
      contentEditableClassName,
      imageUploadHandler,
      autoFocus,
      spellCheck = true,
      disabled = false,
    },
    ref,
  ) => {
    const editorRef = useRef<MDXEditorMethods>(null);
    const [editorModule, setEditorModule] =
      useState<MarkdownEditorModule | null>(null);

    useImperativeHandle(ref, () => editorRef.current as MDXEditorMethods);

    useEffect(() => {
      let cancelled = false;

      void loadMarkdownEditorModule().then((module) => {
        if (!cancelled) {
          setEditorModule(module);
        }
      });

      return () => {
        cancelled = true;
      };
    }, []);

    useEffect(() => {
      const editor = editorRef.current;

      if (!editor) {
        return;
      }

      if (editor.getMarkdown() !== markdown) {
        editor.setMarkdown(markdown);
      }
    }, [markdown]);

    if (!editorModule) {
      return (
        <Field className={cn("gap-2", className)}>
          {label && <FieldTitle>{label}</FieldTitle>}
          {description && <FieldDescription>{description}</FieldDescription>}

          <FieldContent className="gap-0">
            <div
              className={cn(
                "flex min-h-[220px] items-center justify-center rounded-2xl border border-input bg-background shadow-sm",
                disabled && "opacity-70",
                editorClassName,
              )}
              aria-busy="true"
              aria-disabled={disabled}
            >
              <span className="text-sm text-muted-foreground">
                Загружаем редактор Markdown...
              </span>
            </div>

            {error && <FieldError>{error}</FieldError>}
          </FieldContent>
        </Field>
      );
    }

    const {
      BlockTypeSelect,
      BoldItalicUnderlineToggles,
      CodeToggle,
      InsertCodeBlock,
      InsertImage,
      MDXEditor,
      ListsToggle,
      Separator,
      UndoRedo,
      codeBlockPlugin,
      headingsPlugin,
      imagePlugin,
      linkPlugin,
      listsPlugin,
      markdownShortcutPlugin,
      quotePlugin,
      toolbarPlugin,
    } = editorModule;

    return (
      <Field className={cn("gap-2", className)}>
        {label && <FieldTitle>{label}</FieldTitle>}
        {description && <FieldDescription>{description}</FieldDescription>}

        <FieldContent className="gap-0">
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-input bg-background shadow-sm",
              disabled && "opacity-70",
              editorClassName,
            )}
            aria-disabled={disabled}
          >
            <MDXEditor
              ref={editorRef}
              markdown={markdown}
              onChange={(value) => onChange(value)}
              placeholder={placeholder}
              spellCheck={spellCheck}
              autoFocus={autoFocus}
              className="w-full"
              contentEditableClassName={cn(
                "min-h-[220px] px-4 py-4 text-base leading-7 text-foreground focus:outline-none",
                contentEditableClassName,
              )}
              plugins={[
                toolbarPlugin({
                  toolbarContents: () => (
                    <div className="flex flex-wrap items-center gap-1">
                      <UndoRedo />
                      <Separator />
                      <BlockTypeSelect />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CodeToggle />
                      <InsertCodeBlock />
                      <Separator />
                      <InsertImage />
                    </div>
                  ),
                }),
                headingsPlugin(),
                codeBlockPlugin(),
                listsPlugin(),
                quotePlugin(),
                linkPlugin(),
                markdownShortcutPlugin(),
                imagePlugin({
                  imageUploadHandler: imageUploadHandler
                    ? (image) =>
                        normalizeImageUploadResult(imageUploadHandler(image))
                    : undefined,
                }),
              ]}
            />
          </div>

          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      </Field>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";
