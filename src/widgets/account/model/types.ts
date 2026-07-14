import type { ProjectsRelation } from "@/entities/profile/model/types";

export type ExperienceItem = {
  company: string;
  from: string;
  to?: string;
  position: string;
  responsibilities?: string;
};

export type Profile = {
  rating?: number;
  avatar?: string;
  status?: string;
  name?: string;
  profession: string; 
  role?: ProjectsRelation;
  location?: string;
};

export type AccountProfileProps = {
  profile?: Profile;
  skills?: string[];
  qualities?: string[];
  about?: string;
  experience?: ExperienceItem[];
};

export type SkillsFormData = {
  skills: string[];
  qualities: string[];
  about: string;
}
