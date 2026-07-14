import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createExperience,
  type ExperienceCreateRequest,
} from "@/shared/api/profile";
import { PROFILE_QUERY_KEY } from "@/entities/profile/api/use-current-profile";

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExperienceCreateRequest) =>
      createExperience(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (error) => toast.error(error.message),
  });
}
