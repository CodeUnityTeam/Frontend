import { useQuery } from "@tanstack/react-query";

import { getRecommendations } from "@/entities/project/api/get-recommendations";
import type { GetRecommendationsParams } from "@/entities/project/model/types";

const DEFAULT_LIMIT = 20;

const RECOMMENDATIONS_QUERY_KEY = "entities/project/recommendations" as const;

interface UseRecommendationsOptions extends GetRecommendationsParams {
  enabled?: boolean;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const { enabled = true, page = 1, limit = DEFAULT_LIMIT } = options;

  return useQuery({
    queryKey: [RECOMMENDATIONS_QUERY_KEY, { page, limit }],
    queryFn: () => getRecommendations({ page, limit }),
    enabled,
  });
}
