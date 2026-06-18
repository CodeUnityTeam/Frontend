import { useMutation } from "@tanstack/react-query";
import { changeEmailApi } from "@/features/change-email-modal/api/change-email-api";

export function useChangeEmailMutation() {
  return useMutation({ mutationFn: changeEmailApi });
}