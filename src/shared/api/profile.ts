import { apiClient } from "./index";

export type ProjectsRelation = "employer" | "worker";

export type ProfileSkillItem = {
  skill_id: string;
  name: string;
};

export type ProfileSpecializationItem = {
  spec_id: string;
  name: string;
};

export type ProfileWorkFormatItem = {
  format_id: string;
  name: string;
};

export type ProfileExperienceItem = {
  pk: string;
  company: string;
  position: string;
  responsibilities: string;
  start_date: string;
  end_date: string | null;
};

export type CurrentUserProfile = {
  pk: string;
  email: string;
  first_name: string;
  last_name: string;
  role: ProjectsRelation;
  projects_relation: ProjectsRelation;
  phone_number: string;
  additional_contact: string;
  country: string;
  city: string;
  soft_skills: string;
  about_me: string;
  avatar_url: string;
  skills: ProfileSkillItem[];
  specializations: ProfileSpecializationItem[];
  workformats: ProfileWorkFormatItem[];
  experiences: ProfileExperienceItem[];
  rating: number;
};

export type OnboardingPrefill = {
  name: string;
  surname: string;
  email: string;
};

export type ProfileUpdateRequest = {
  first_name?: string;
  last_name?: string;
  projects_relation?: ProjectsRelation;
  phone_number?: string;
  additional_contact?: string;
  country?: string;
  city?: string;
  soft_skills?: string;
  about_me?: string;
  skills?: string[];
  specializations?: string[];
  workformats?: string[];
};

export type ExperienceCreateRequest = {
  company: string;
  position: string;
  responsibilities: string;
  start_date: string;
  end_date: string | null;
};

type ApiObject = Record<string, unknown>;

function isFilledText(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const { data } = await apiClient.get<CurrentUserProfile>("/user/profile/me/");
  return data;
}

export function buildOnboardingPrefill(
  profile: Pick<CurrentUserProfile, "first_name" | "last_name" | "email">,
): OnboardingPrefill {
  return {
    name: profile.first_name,
    surname: profile.last_name,
    email: profile.email,
  };
}

export function needsOnboarding(
  profile: Pick<
    CurrentUserProfile,
    | "country"
    | "city"
    | "soft_skills"
    | "about_me"
    | "skills"
    | "specializations"
    | "workformats"
    | "experiences"
  >,
): boolean {
  const hasCoreProfile = [
    isFilledText(profile.country),
    isFilledText(profile.city),
    isFilledText(profile.soft_skills),
    isFilledText(profile.about_me),
    profile.skills.length > 0,
    profile.specializations.length > 0,
    profile.workformats.length > 0,
    profile.experiences.length > 0,
  ].every(Boolean);

  return !hasCoreProfile;
}

export async function updateCurrentUserProfile(payload: ProfileUpdateRequest) {
  const { data } = await apiClient.patch<ApiObject>(
    "/user/profile/me/",
    payload,
  );
  return data;
}

export async function createExperience(payload: ExperienceCreateRequest) {
  const { data } = await apiClient.post<ApiObject>(
    "/user/profile/me/experience/",
    payload,
  );
  return data;
}

export async function uploadCurrentUserAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<unknown>(
    "/user/profile/me/avatar/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (typeof data === "object" && data !== null && "avatar_url" in data) {
    const avatarUrl = (data as { avatar_url?: unknown }).avatar_url;
    if (typeof avatarUrl === "string") {
      return avatarUrl;
    }
  }

  return "";
}
