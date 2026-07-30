import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type FileUploadStatus = "idle" | "uploading" | "success" | "failed";

export type FileUploadQueueItem<TResponse = unknown> = {
  id: string;
  file: File;
  status: FileUploadStatus;
  errorMessage?: string;
  response?: TResponse;
  completedAt?: number;
};

export type UseFileUploadQueueOptions<TResponse> = {
  uploadFile: (file: File) => Promise<TResponse>;
  validateFile?: (file: File) => string | null;
  onSuccess?: (item: FileUploadQueueItem<TResponse>, response: TResponse) => void;
  onFailure?: (item: FileUploadQueueItem<TResponse>, errorMessage: string) => void;
};

function createUploadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return "Не удалось загрузить файл.";
}

export function useFileUploadQueue<TResponse>({
  uploadFile,
  validateFile,
  onSuccess,
  onFailure,
}: UseFileUploadQueueOptions<TResponse>) {
  const [items, setItems] = useState<Array<FileUploadQueueItem<TResponse>>>([]);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const updateItem = useCallback(
    (
      itemId: string,
      updater: (
        item: FileUploadQueueItem<TResponse>,
      ) => FileUploadQueueItem<TResponse>,
    ) => {
      setItems((current) =>
        current.map((item) => (item.id === itemId ? updater(item) : item)),
      );
    },
    [],
  );

  const runUpload = useCallback(
    async (item: FileUploadQueueItem<TResponse>) => {
      updateItem(item.id, (current) => ({
        ...current,
        status: "uploading",
        errorMessage: undefined,
        completedAt: undefined,
      }));

      try {
        const response = await uploadFile(item.file);
        const finishedAt = Date.now();

        let uploadedItem: FileUploadQueueItem<TResponse> | undefined;
        updateItem(item.id, (current) => {
          uploadedItem = {
            ...current,
            status: "success",
            response,
            errorMessage: undefined,
            completedAt: finishedAt,
          };

          return uploadedItem;
        });

        if (uploadedItem) {
          onSuccess?.(uploadedItem, response);
        }

        return;
      } catch (error) {
        const errorMessage = normalizeError(error);

        let failedItem: FileUploadQueueItem<TResponse> | undefined;
        updateItem(item.id, (current) => {
          failedItem = {
            ...current,
            status: "failed",
            errorMessage,
            completedAt: Date.now(),
          };

          return failedItem;
        });

        if (failedItem) {
          onFailure?.(failedItem, errorMessage);
        }
      }
    },
    [onFailure, onSuccess, updateItem, uploadFile],
  );

  const enqueueFiles = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        const validationError = validateFile?.(file) ?? null;
        const item: FileUploadQueueItem<TResponse> = {
          id: createUploadId(),
          file,
          status: validationError ? "failed" : "uploading",
          errorMessage: validationError ?? undefined,
        };

        setItems((current) => [...current, item]);

        if (!validationError) {
          void runUpload(item);
        }
      });
    },
    [runUpload, validateFile],
  );

  const retryItem = useCallback(
    (itemId: string) => {
      const item = itemsRef.current.find((currentItem) => currentItem.id === itemId);

      if (!item) {
        return;
      }

      const validationError = validateFile?.(item.file) ?? null;
      if (validationError) {
        updateItem(item.id, (current) => ({
          ...current,
          status: "failed",
          errorMessage: validationError,
          completedAt: Date.now(),
        }));
        return;
      }

      void runUpload(item);
    },
    [runUpload, updateItem, validateFile],
  );

  const uploadState = useMemo<FileUploadStatus>(() => {
    if (items.length === 0) {
      return "idle";
    }

    if (items.some((item) => item.status === "uploading")) {
      return "uploading";
    }

    if (items.some((item) => item.status === "failed")) {
      return "failed";
    }

    return "success";
  }, [items]);

  return {
    items,
    uploadState,
    enqueueFiles,
    retryItem,
  };
}