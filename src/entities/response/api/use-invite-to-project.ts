import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { toast } from "sonner";
import type { CreateResponseResponse } from "../model/types";

export function useInviteToProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post<CreateResponseResponse>(
        `/projects/${projectId}/invite/${userId}/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Приглашение отправлено");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Не удалось отправить приглашение";
      toast.error(message);
    },
  });
}