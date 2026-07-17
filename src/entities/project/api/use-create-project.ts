import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createProject,
  type CreateProjectDto,
} from "@/entities/project/api/create-project";
import { PROJECTS_QUERY_KEY } from "@/entities/project/api/use-projects";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(dto),

    onSuccess: () => {
      toast.success("Проект создан");
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },

    onError: (error) => toast.error(error.message),
  });
}
