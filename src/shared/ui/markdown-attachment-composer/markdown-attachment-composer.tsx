import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

import {
  MarkdownImageField,
  type MarkdownAttachment,
  type MarkdownImageFieldProps,
} from "@/shared/ui/markdown-image-field";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";

type MarkdownAttachmentComposerProps = {
  markdown: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: MarkdownImageFieldProps["imageUploadHandler"];
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  editorClassName?: string;
  contentEditableClassName?: string;
  disabled?: boolean;
};

function imageMarkdown(attachment: MarkdownAttachment) {
  return `![${attachment.originalName.replace(/\.[^.]+$/, "")}](${attachment.url})`;
}

export const MarkdownAttachmentComposer = forwardRef<
  MDXEditorMethods,
  MarkdownAttachmentComposerProps
>(function MarkdownAttachmentComposer(
  {
    markdown,
    onChange,
    imageUploadHandler,
    label,
    description,
    error,
    placeholder,
    editorClassName,
    contentEditableClassName,
    disabled,
  },
  ref,
) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const pendingInsertionsRef = useRef<string[]>([]);
  useImperativeHandle(ref, () => editorRef.current as MDXEditorMethods);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const editor = editorRef.current;
      if (!editor || pendingInsertionsRef.current.length === 0) {
        return;
      }

      const insertions = pendingInsertionsRef.current.splice(0);
      insertions.forEach((value) => {
        editor.focus(() => editor.insertMarkdown(value), {
          defaultSelection: "rootEnd",
        });
      });
    }, 50);

    return () => window.clearInterval(interval);
  }, []);

  const insertMarkdown = (value: string) => {
    const editor = editorRef.current;
    if (!editor) {
      pendingInsertionsRef.current.push(value);
      return;
    }

    editor.focus(() => editor.insertMarkdown(value), {
      defaultSelection: "rootEnd",
    });
  };

  const insert = (attachment: MarkdownAttachment) => {
    if (attachment.url) {
      insertMarkdown(imageMarkdown(attachment));
    }
  };

  const insertAll = (attachments: MarkdownAttachment[]) => {
    insertMarkdown(
      attachments
        .filter((attachment) => attachment.url)
        .map(imageMarkdown)
        .join("\n\n"),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <MarkdownImageField
        markdown={markdown}
        onChange={onChange}
        imageUploadHandler={imageUploadHandler}
        label={undefined}
        description={undefined}
        hideTextarea
        collapsible
        maxFilesPerBatch={5}
        onInsertAttachment={insert}
        onInsertAllAttachments={insertAll}
        disabled={disabled}
      />
      <MarkdownEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        label={label}
        description={description}
        error={error}
        placeholder={placeholder}
        editorClassName={editorClassName}
        contentEditableClassName={contentEditableClassName}
        disabled={disabled}
        imageUploadHandler={imageUploadHandler}
      />
    </div>
  );
});

MarkdownAttachmentComposer.displayName = "MarkdownAttachmentComposer";
