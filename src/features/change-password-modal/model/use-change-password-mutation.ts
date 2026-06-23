import { useMutation } from "@tanstack/react-query";
import { changePasswordApi } from "@/features/change-password-modal/api/change-password-api";

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: changePasswordApi });
}