export { useProjects } from "./api/use-projects";
export { createProject } from "./api/create-project";
export { updateProject } from "./api/update-project";
export type { CreateProjectDto, ProjectStatus } from "./api/create-project";
export type { UpdateProjectDto } from "./api/update-project";
export { useRecommendations } from "./api/use-recommendations";
export {
  type Project,
  type ProjectDetails,
  type Author,
  type Participant,
  type Skill,
  type Specialization,
  type ProjectFormat,
  type ProjectsPage,
  type GetProjectsParams,
  type GetRecommendationsParams,
} from "./model/types";

export interface ProjectSkill {
  skill_id: string;
  name: string;
}
