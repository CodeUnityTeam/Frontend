import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { toast } from "sonner";
import type { CreateResponseResponse } from "../model/types";

export function useRespondToProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<CreateResponseResponse>(
        `/projects/${projectId}/responses/`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Отклик отправлен");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Не удалось откликнуться на проект";
      toast.error(message);
    },
  });
}