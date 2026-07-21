import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateExperience,
  type ExperienceUpdateRequest,
} from "@/shared/api/profile";
import { PROFILE_QUERY_KEY } from "@/entities/profile/api/use-current-profile";

interface UpdateExperienceVars {
  id: string;
  payload: ExperienceUpdateRequest;
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateExperienceVars) =>
      updateExperience(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message),
  });
}
