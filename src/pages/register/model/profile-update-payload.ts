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
  return {
    first_name: data.name.trim(),
    last_name: data.surname.trim(),
    projects_relation: data.employmentRole,
    country: data.country?.trim() ?? "",
    city: data.city?.trim() ?? "",
    soft_skills: (data.qualities ?? [])
      .map((quality) => quality.trim())
      .filter(Boolean)
      .join(", "),
    about_me: data.about.trim(),
    skills: resolveSkillIds(data.skills ?? [], catalogs.skills),

    specializations: [],
    workformats: resolveWorkformatIds(data.format, catalogs.formats),
  };
}
