import { useQuery } from "@tanstack/react-query";

import { getCurrentUserProfile } from "@/shared/api/profile";

export function useCurrentProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: getCurrentUserProfile,
  });
}
