import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProject } from "@/entities/project/api/delete-project";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),

    onSuccess: () => {
      toast.success("Проект удалён");
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },

    onError: (error) => toast.error(error.message),
  });
}
