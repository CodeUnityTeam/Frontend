import type { ProjectsRelation } from "@/entities/profile";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface UserDetailsDto {
  pk: string;
  email: string;
  first_name: string;
  last_name: string;
  role: ProjectsRelation; 
  rating: number;
  projects_relation: ProjectsRelation;
  phone_number: string;
  additional_contact: string;
  country: string;
  city: string;
  soft_skills: string;
  about_me: string;
  avatar_url: string;
  skills: {
    skill_id: string;
    name: string;
  }[];
  specializations: {
    spec_id: string;
    name: string;
  }[];
  workformats: {
    format_id: string;
    name: string;
  }[];
}

export interface LoginResponseDto {
  access: string;
  refresh: string;
  user: UserDetailsDto;
}

export function mapUserDetails(dto: UserDetailsDto): AuthUser {
  return {
    id: dto.pk,
    name: [dto.first_name, dto.last_name].filter(Boolean).join(" "),
    email: dto.email,
  };
}
