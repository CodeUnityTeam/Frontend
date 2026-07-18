import { apiClient } from "./api-client";

export type Document = {
  slug: string;
  title: string;
  file_url: string;
};

export async function getDocuments(): Promise<Document[]> {
  const { data } = await apiClient.get<Document[]>("/documents/");
  return data;
}

export function getDocumentBySlug(documents: Document[], slug: string): Document | undefined {
  return documents.find((doc) => doc.slug === slug);
}