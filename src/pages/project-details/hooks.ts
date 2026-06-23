import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ApiError } from "@/shared/api/api-error";
import { fetchProject } from "./api";
import type { ProjectDetails } from "@/entities/project/model/types";

export const useProject = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery<ProjectDetails, ApiError>({
    queryKey: ["project-details", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
};