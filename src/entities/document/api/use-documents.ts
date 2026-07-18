import { useQuery } from "@tanstack/react-query";
import { getDocuments, type Document } from "@/shared/api/documents";

export const documentsKeys = {
  all: ["documents"] as const,
  lists: () => [...documentsKeys.all, "list"] as const,
};

export function useDocuments() {
  return useQuery({
    queryKey: documentsKeys.lists(),
    queryFn: getDocuments,
  });
}

export function getDocumentBySlug(documents: Document[] | undefined, slug: string): Document | undefined {
  return documents?.find((doc) => doc.slug === slug);
}