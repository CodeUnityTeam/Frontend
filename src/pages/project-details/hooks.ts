import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ApiError } from "@/shared/api/api-error";
import { fetchProject } from "./api";
import type { Project } from "../../entities/project/model/types";

export const useProject = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery<Project, ApiError>({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
};