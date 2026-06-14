import {
  AUTH_REQUEST_CREDENTIALS,
  createApiRequestError,
  getAccessTokenFromCookie,
  parseJsonSafe,
} from "./auth";

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

export async function updateCurrentUserProfile(
  payload: ProfileUpdateRequest,
) {
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
