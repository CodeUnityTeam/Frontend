import type { ReferenceItem } from "@/entities/reference";
import type { Skill } from "@/entities/skill";
import type { ProfileUpdateRequest } from "@/shared/api/profile";
import type { RegisterFormData } from "@/pages/register/model/use-register-form";

export interface OnboardingCatalogs {
  skills: Skill[];
  formats: ReferenceItem[];
}

const WORKFORMAT_NAME_BY_VALUE: Record<string, string> = {
  remote: "Удалённо",
  hybrid: "Гибрид",
  office: "В офисе",
};

function normalizeLookupKey(value: string): string {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

function resolveSkillIds(skillNames: string[], catalog: Skill[]): string[] {
  const idByName = new Map(
    catalog.map((skill) => [normalizeLookupKey(skill.name), skill.skillId]),
  );

  const ids = skillNames
    .map((name) => idByName.get(normalizeLookupKey(name)))
    .filter((id): id is string => Boolean(id));

  return Array.from(new Set(ids));
}

function resolveWorkformatIds(
  format: string | undefined,
  catalog: ReferenceItem[],
): string[] {
  const formatName = format ? WORKFORMAT_NAME_BY_VALUE[format] : undefined;
  if (!formatName) {
    return [];
  }

  const match = catalog.find(
    (item) => normalizeLookupKey(item.name) === normalizeLookupKey(formatName),
  );

  return match ? [match.id] : [];
}

export function buildProfileUpdatePayload(
  data: RegisterFormData,
  catalogs: OnboardingCatalogs,
): ProfileUpdateRequest {
  const payload: ProfileUpdateRequest = {
    projects_relation: data.employmentRole,
    workformats: resolveWorkformatIds(data.format, catalogs.formats),
  };

  const skills = resolveSkillIds(data.skills ?? [], catalogs.skills);
  if (skills.length > 0) {
    payload.skills = skills;
  }

  const country = data.country?.trim() ?? "";
  if (country) {
    payload.country = country;
  }

  const city = data.city?.trim() ?? "";
  if (city) {
    payload.city = city;
  }

  const softSkills = (data.qualities ?? [])
    .map((quality) => quality.trim())
    .filter(Boolean);
  if (softSkills.length > 0) {
    payload.soft_skills = softSkills.join(", ");
  }

  const about = data.about.trim();
  if (about) {
    payload.about_me = about;
  }

  return payload;
}
