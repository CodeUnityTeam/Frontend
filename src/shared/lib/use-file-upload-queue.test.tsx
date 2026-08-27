import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useFileUploadQueue } from "./use-file-upload-queue";

function createFile(name: string, type = "image/png") {
  return new File(["image"], name, { type });
}

describe("useFileUploadQueue", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds validation failures without calling the uploader", () => {
    // Init
    const uploadFile = vi.fn();
    const validateFile = vi.fn(() => "Unsupported file");
    const { result } = renderHook(() =>
      useFileUploadQueue({ uploadFile, validateFile }),
    );

    // Action
    act(() => result.current.enqueueFiles([createFile("invalid.gif", "image/gif")]));

    // Assert
    expect(result.current.uploadState).toBe("failed");
    expect(result.current.items).toEqual([
      expect.objectContaining({
        file: expect.any(File),
        status: "failed",
        errorMessage: "Unsupported file",
      }),
    ]);
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("records a successful upload response and calls the success callback", async () => {
    // Init
    const file = createFile("diagram.png");
    const uploadFile = vi.fn().mockResolvedValue({ url: "/diagram.png" });
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadQueue({ uploadFile, onSuccess }),
    );

    // Action
    act(() => result.current.enqueueFiles([file]));

    // Assert
    await waitFor(() => expect(result.current.uploadState).toBe("success"));
    expect(uploadFile).toHaveBeenCalledWith(file);
    expect(result.current.items[0]).toEqual(
      expect.objectContaining({
        file,
        status: "success",
        response: { url: "/diagram.png" },
        completedAt: expect.any(Number),
      }),
    );
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success", file }),
      { url: "/diagram.png" },
    );
  });

  it("normalizes upload failures and retries a failed item", async () => {
    // Init
    const file = createFile("retry.png");
    const uploadFile = vi
      .fn()
      .mockRejectedValueOnce("temporary error")
      .mockResolvedValueOnce({ url: "/retry.png" });
    const onFailure = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadQueue({ uploadFile, onFailure }),
    );

    // Action
    act(() => result.current.enqueueFiles([file]));
    await waitFor(() => expect(result.current.uploadState).toBe("failed"));
    act(() => result.current.retryItem(result.current.items[0].id));

    // Assert
    await waitFor(() => expect(result.current.uploadState).toBe("success"));
    expect(onFailure).toHaveBeenCalledWith(
      expect.objectContaining({ status: "failed", file }),
      "temporary error",
    );
    expect(uploadFile).toHaveBeenCalledTimes(2);
  });

  it("discards a pending upload completion after clearing the queue", async () => {
    // Init
    let resolveUpload!: (value: { url: string }) => void;
    const uploadFile = vi.fn(
      () => new Promise<{ url: string }>((resolve) => (resolveUpload = resolve)),
    );
    const onSuccess = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadQueue({ uploadFile, onSuccess }),
    );

    // Action
    act(() => result.current.enqueueFiles([createFile("pending.png")]));
    act(() => result.current.clearQueue());
    await act(async () => resolveUpload({ url: "/pending.png" }));

    // Assert
    expect(result.current.items).toEqual([]);
    expect(result.current.uploadState).toBe("idle");
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
