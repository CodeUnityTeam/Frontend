import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { inviteUser } from "@/entities/project/api/invite-user";

interface InviteMutationVars {
  projectId: string;
  userId: string;
}

export function useInviteUser() {
  return useMutation({
    mutationFn: ({ projectId, userId }: InviteMutationVars) =>
      inviteUser(projectId, userId),
    onSuccess: () => toast.success("Приглашение отправлено"),
    onError: () => toast.error("Не удалось отправить приглашение"),
  });
}
