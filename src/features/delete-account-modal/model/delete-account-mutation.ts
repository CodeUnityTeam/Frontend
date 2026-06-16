import { useMutation } from "@tanstack/react-query";
import { deleteAccountApi } from "@/features/delete-account-modal/api/delete-account-api";

export function useDeleteAccount() {
  return useMutation({mutationFn: deleteAccountApi})
}