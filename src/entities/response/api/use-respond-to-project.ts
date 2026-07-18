import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { applyToProject } from "@/shared/api/projects";
import { RESPONSES_QUERY_KEY } from "@/entities/response/api/use-responses";

export function useRespondToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => applyToProject(projectId),

    onSuccess: () => {
      toast.success("Отклик отправлен");
      queryClient.invalidateQueries({ queryKey: [RESPONSES_QUERY_KEY] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}
