import { useMutation } from "@tanstack/react-query";
import { resetPasswordConfirmApi } from "@/features/reset-password/api/reset-password-api";

export function useResetPasswordConfirm() {
  return useMutation({ mutationFn: resetPasswordConfirmApi });
}
