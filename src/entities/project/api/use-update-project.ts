import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateProject,
  type UpdateProjectDto,
} from "@/entities/project/api/update-project";
import { PROJECT_DETAIL_QUERY_KEY } from "@/entities/project/api/use-project";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";

interface UpdateProjectVars {
  projectId: string;
  dto: UpdateProjectDto;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, dto }: UpdateProjectVars) =>
      updateProject(projectId, dto),

    onSuccess: (_data, { projectId }) => {
      toast.success("Проект сохранён");
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_DETAIL_QUERY_KEY, projectId],
      });
    },

    onError: (error) => toast.error(error.message),
  });
}
