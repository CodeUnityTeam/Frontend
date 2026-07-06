import { useQuery } from "@tanstack/react-query";

import { getCurrentUserProfile } from "@/shared/api/profile";

interface UseCurrentProfileOptions {
  enabled?: boolean;
}

export function useCurrentProfile({
  enabled = true,
}: UseCurrentProfileOptions = {}) {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: getCurrentUserProfile,
    enabled,
  });
}
