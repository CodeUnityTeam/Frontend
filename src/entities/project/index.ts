export { useProjects } from "./api/use-projects";
export { useProject } from "./api/use-project";
export { useCreateProject } from "./api/use-create-project";
export { useUpdateProject } from "./api/use-update-project";
export { useDeleteProject } from "./api/use-delete-project";
export type { CreateProjectDto, ProjectStatus } from "./api/create-project";
export type { UpdateProjectDto } from "./api/update-project";
export { useRecommendations } from "./api/use-recommendations";
export { useLikeProject } from "./api/use-like-project";
export { useFavoriteProject } from "./api/use-favorite-project";
export {
  type Project,
  type ProjectDetails,
  type Author,
  type Participant,
  type Skill,
  type Specialization,
  type ProjectFormat,
  type ProjectsPage,
  type ProjectLikeResponse,
  type ProjectFavoriteResponse,
  type GetProjectsParams,
  type GetRecommendationsParams,
} from "./model/types";

export interface ProjectSkill {
  skill_id: string;
  name: string;
}
