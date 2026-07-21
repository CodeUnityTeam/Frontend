import { useQuery } from "@tanstack/react-query";

import { getCurrentUserProfile } from "@/shared/api/profile";

export const PROFILE_QUERY_KEY = "entities/profile/me" as const;

interface UseCurrentProfileOptions {
  enabled?: boolean;
}

export function useCurrentProfile({
  enabled = true,
}: UseCurrentProfileOptions = {}) {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getCurrentUserProfile,
    enabled,
  });
}
