import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertCodeBlock,
  InsertImage,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  ListsToggle,
  UndoRedo,
  codeBlockPlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { cn } from "@/shared/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldTitle,
} from "@/shared/ui/field";

type MarkdownImageUploadResult = string | { imageUrl: string };

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

    useImperativeHandle(ref, () => editorRef.current as MDXEditorMethods, []);

    useEffect(() => {
      const editor = editorRef.current;

      if (!editor) {
        return;
      }

      if (editor.getMarkdown() !== markdown) {
        editor.setMarkdown(markdown);
      }
    }, [markdown]);

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
                    ? (image) => normalizeImageUploadResult(imageUploadHandler(image))
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
