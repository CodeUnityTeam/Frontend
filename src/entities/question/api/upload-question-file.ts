import { apiClient } from "@/shared/api";

export type UploadQuestionFileResponse = {
  imageUrl: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
};

type UploadQuestionFileResponseDto = {
  image_url: string;
  original_name: string;
  file_size: number;
  mime_type: string;
};

export async function uploadQuestionFile(
  file: File,
): Promise<UploadQuestionFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UploadQuestionFileResponseDto>(
    "/qna/files/upload/",
    formData,
  );

  return {
    imageUrl: data.image_url,
    originalName: data.original_name,
    fileSize: data.file_size,
    mimeType: data.mime_type,
  };
}