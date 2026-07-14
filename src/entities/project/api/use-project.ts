import { useQuery } from "@tanstack/react-query";

import { getProject } from "@/entities/project/api/get-project";

export const PROJECT_DETAIL_QUERY_KEY = "entities/project/detail" as const;

export function useProject(projectId?: string) {
  return useQuery({
    queryKey: [PROJECT_DETAIL_QUERY_KEY, projectId],
    queryFn: () => getProject(projectId!),
    enabled: Boolean(projectId),
  });
}
