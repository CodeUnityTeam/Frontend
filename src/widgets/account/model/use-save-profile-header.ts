import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PROFILE_QUERY_KEY } from "@/entities/profile";
import {
  deleteCurrentUserAvatar,
  updateCurrentUserProfile,
  uploadCurrentUserAvatar,
  type ProfileUpdateRequest,
} from "@/shared/api/profile";

interface SaveProfileHeaderVars {
  profile: ProfileUpdateRequest;
  avatarFile: File | null;
  removeAvatar: boolean;
}

export function useSaveProfileHeader() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profile,
      avatarFile,
      removeAvatar,
    }: SaveProfileHeaderVars) => {
      if (avatarFile) {
        await uploadCurrentUserAvatar(avatarFile);
      } else if (removeAvatar) {
        await deleteCurrentUserAvatar();
      }
      return updateCurrentUserProfile(profile);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) => toast.error(error.message),
  });
}
