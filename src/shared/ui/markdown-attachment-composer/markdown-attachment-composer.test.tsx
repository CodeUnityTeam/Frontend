import { fireEvent, render, screen } from "@testing-library/react";
import { forwardRef, useImperativeHandle } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const editor = vi.hoisted(() => ({ focus: vi.fn(), insertMarkdown: vi.fn() }));

vi.mock("@/shared/ui/markdown-image-field", () => ({
  MarkdownImageField: ({ onInsertAllAttachments, onInsertAttachment }: { onInsertAllAttachments: (attachments: unknown[]) => void; onInsertAttachment: (attachment: unknown) => void }) => (
    <div>
      <button onClick={() => onInsertAttachment({ originalName: "diagram.final.png", url: "/diagram.png" })}>Insert one</button>
      <button onClick={() => onInsertAllAttachments([{ originalName: "first.png", url: "/first.png" }, { originalName: "missing.png", url: "" }, { originalName: "second.jpg", url: "/second.jpg" }])}>Insert all</button>
    </div>
  ),
}));

vi.mock("@/shared/ui/markdown-editor", () => ({
  MarkdownEditor: forwardRef(function MarkdownEditor(_, ref) {
    useImperativeHandle(ref, () => editor);
    return <div data-testid="editor" />;
  }),
}));

import { MarkdownAttachmentComposer } from "./markdown-attachment-composer";

describe("MarkdownAttachmentComposer", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a single uploaded attachment at the editor root end", () => {
    // Init
    editor.focus.mockImplementation((callback: () => void) => callback());
    render(<MarkdownAttachmentComposer markdown="Draft" onChange={vi.fn()} imageUploadHandler={vi.fn()} />);

    // Action
    fireEvent.click(screen.getByRole("button", { name: "Insert one" }));

    // Assert
    expect(editor.focus).toHaveBeenCalledWith(expect.any(Function), { defaultSelection: "rootEnd" });
    expect(editor.insertMarkdown).toHaveBeenCalledWith("![diagram.final](/diagram.png)");
  });

  it("inserts only valid batch attachments as blank-line-separated Markdown", () => {
    // Init
    editor.focus.mockImplementation((callback: () => void) => callback());
    render(<MarkdownAttachmentComposer markdown="Draft" onChange={vi.fn()} imageUploadHandler={vi.fn()} />);

    // Action
    fireEvent.click(screen.getByRole("button", { name: "Insert all" }));

    // Assert
    expect(editor.insertMarkdown).toHaveBeenCalledWith("![first](/first.png)\n\n![second](/second.jpg)");
    expect(editor.insertMarkdown).not.toHaveBeenCalledWith(expect.stringContaining("missing"));
  });
});
