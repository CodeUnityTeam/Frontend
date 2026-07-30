import { apiClient } from "./api-client";

type UploadMultipartFileOptions = {
  fieldName?: string;
  headers?: Record<string, string>;
};

export async function uploadMultipartFile<TResponse>(
  url: string,
  file: File,
  options: UploadMultipartFileOptions = {},
): Promise<TResponse> {
  const formData = new FormData();
  formData.append(options.fieldName ?? "file", file);

  const { data } = await apiClient.post<TResponse>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...options.headers,
    },
  });

  return data;
}