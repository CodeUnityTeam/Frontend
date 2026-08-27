import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MarkdownImageField } from "./markdown-image-field";

function createImage(name: string, size = 5) {
  return new File(["x".repeat(size)], name, { type: "image/png" });
}

function renderField(overrides: Partial<React.ComponentProps<typeof MarkdownImageField>> = {}) {
  const onChange = vi.fn();
  const imageUploadHandler = vi.fn().mockResolvedValue("/uploads/image.png");

  render(
    <MarkdownImageField
      markdown="Before after"
      onChange={onChange}
      imageUploadHandler={imageUploadHandler}
      label="Content"
      {...overrides}
    />,
  );

  return { imageUploadHandler, onChange };
}

describe("MarkdownImageField", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads a valid file and inserts its markdown at the selection", async () => {
    // Init
    const user = userEvent.setup();
    const { imageUploadHandler, onChange } = renderField();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const textarea = screen.getByRole("textbox", {
      name: "Content",
    }) as HTMLTextAreaElement;
    textarea.setSelectionRange(7, 7);

    // Action
    await user.upload(fileInput, createImage("diagram.png"));
    await screen.findByRole("button", { name: "Вставить в редактор" });
    await user.click(screen.getByRole("button", { name: "Вставить в редактор" }));

    // Assert
    expect(imageUploadHandler).toHaveBeenCalledWith(expect.any(File));
    expect(screen.getByRole("button", { name: "Вставить в редактор" })).toBeEnabled();
    expect(onChange).toHaveBeenLastCalledWith(
      "Before ![diagram](/uploads/image.png)after",
    );
  });

  it("reports validation errors without starting an upload", async () => {
    // Init
    const user = userEvent.setup();
    const { imageUploadHandler } = renderField({ maxFileSizeBytes: 4 });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Action
    await user.upload(fileInput, createImage("large.png", 5));

    // Assert
    expect(
      screen.getByText("Файл «large.png» превышает лимит 4 B."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Повторить" })).toBeInTheDocument();
    expect(imageUploadHandler).not.toHaveBeenCalled();
  });

  it("uses uploaded attachments through the external bulk insert callback", async () => {
    // Init
    const user = userEvent.setup();
    const onInsertAllAttachments = vi.fn();
    renderField({ onInsertAllAttachments });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Action
    await user.upload(fileInput, [createImage("first.png"), createImage("second.png")]);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Вставить все" })).toBeEnabled(),
    );
    await user.click(screen.getByRole("button", { name: "Вставить все" }));

    // Assert
    expect(onInsertAllAttachments).toHaveBeenCalledWith([
      expect.objectContaining({
        originalName: "first.png",
        status: "success",
        url: "/uploads/image.png",
      }),
      expect.objectContaining({
        originalName: "second.png",
        status: "success",
        url: "/uploads/image.png",
      }),
    ]);
  });

  it("accepts dropped files and limits a batch to the configured maximum", async () => {
    // Init
    const { imageUploadHandler } = renderField({ maxFilesPerBatch: 1 });
    const dropZone = screen.getByRole("button", { name: /Нажмите, чтобы выбрать файлы/i });
    const first = createImage("first.png");
    const second = createImage("second.png");
    const dataTransfer = { files: [first, second], dropEffect: "none" } as unknown as DataTransfer;

    // Action
    fireEvent.drop(dropZone, { dataTransfer });

    // Assert
    await waitFor(() => expect(imageUploadHandler).toHaveBeenCalledOnce());
    expect(imageUploadHandler).toHaveBeenCalledWith(first);
    expect(
      screen.getByText("Можно загрузить не более 1 изображений за раз."),
    ).toBeInTheDocument();
  });
});
