import {
  AUTH_REQUEST_CREDENTIALS,
  createApiRequestError,
  getAccessTokenFromCookie,
  parseJsonSafe,
} from "./auth";

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
  role: string;
  projects_relation: "employer" | "worker";
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
};

export type OnboardingPrefill = {
  name: string;
  surname: string;
  email: string;
};

export type ProfileSkillReference = {
  skill_id: string;
};

export type ProfileSpecializationReference = {
  spec_id: string;
};

export type ProfileWorkFormatReference = {
  format_id: string;
};

export type ProfileUpdateRequest = {
  first_name: string;
  last_name: string;
  projects_relation: "employer" | "worker";
  phone_number: string;
  additional_contact: string;
  country: string;
  city: string;
  soft_skills: string;
  about_me: string;
  avatar_url: string;
  skills: ProfileSkillReference[];
  specializations: ProfileSpecializationReference[];
  workformats: ProfileWorkFormatReference[];
};

type ApiObject = Record<string, unknown>;

function getApiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL as string;
  return `${base.replace(/\/$/, "")}${path}`;
}

function isFilledText(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function requireAccessToken(): string {
  const token = getAccessTokenFromCookie();
  if (!token) {
    throw createApiRequestError(
      "Access token is required for profile updates",
      401,
    );
  }
  return token;
}

export async function getCurrentUserProfile() {
  const token = requireAccessToken();
  const url = getApiUrl("/api/v1/user/profile/me/");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: AUTH_REQUEST_CREDENTIALS,
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw createApiRequestError("Profile fetch failed", response.status, data);
  }

  return data as CurrentUserProfile;
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
  const token = requireAccessToken();
  const url = getApiUrl("/api/v1/user/profile/me/");

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    credentials: AUTH_REQUEST_CREDENTIALS,
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw createApiRequestError("Profile update failed", response.status, data);
  }

  return data as ApiObject;
}

export async function uploadCurrentUserAvatar(file: File) {
  const token = requireAccessToken();
  const url = getApiUrl("/api/v1/user/profile/me/avatar/");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    credentials: AUTH_REQUEST_CREDENTIALS,
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw createApiRequestError("Avatar upload failed", response.status, data);
  }

  if (typeof data === "object" && data !== null && "avatar_url" in data) {
    const avatarUrl = (data as { avatar_url?: unknown }).avatar_url;
    if (typeof avatarUrl === "string") {
      return avatarUrl;
    }
  }

  return "";
}
