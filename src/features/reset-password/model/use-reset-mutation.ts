import {useMutation} from "@tanstack/react-query";
import { resetPasswordApi } from "@/features/reset-password/api/reset-password-api";

export function useResetPassword() {
  return useMutation({ mutationFn: resetPasswordApi });
}