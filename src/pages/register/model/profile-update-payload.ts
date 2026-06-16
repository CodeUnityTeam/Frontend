import { tags } from "@/widgets/tags/model/tags";

import type { ProfileUpdateRequest } from "@/shared/api/profile";
import type { SkillCatalogItem } from "@/shared/api/skills";
import type { RegisterFormData } from "./use-register-form";

const TAG_VALUE_BY_LABEL = new Map(
  tags.map((tag) => [normalizeLookupKey(tag.label), tag.value]),
);

const WORKFORMAT_ID_BY_VALUE: Record<string, string> = {
  remote: "f2b7f6f4-6ebe-4374-b861-977f9297790c",
  hybrid: "450eab94-627f-4805-81b0-e8bcca4a0e7c",
  office: "220ed170-25ab-4026-9cd3-8a817c12348f",
};

const SPECIALIZATION_ID_BY_KEY: Record<string, string> = {
  frontend: "43f449e6-c978-4248-86f7-dac3d7b9cece",
  backend: "2b4a9c82-b6f8-4441-9268-ef5883595833",
  design: "63d6eeaf-7291-4baa-92df-22f42fd188f3",
  uiux: "63d6eeaf-7291-4baa-92df-22f42fd188f3",
  product: "2d4244ed-b9dd-435c-a50e-c799b9a14288",
  gamedev: "64c590ee-bb49-4bb1-8f22-eb828a475f43",
  mobile: "58468414-6924-44ba-bc4b-54605beebc48",
  android: "58468414-6924-44ba-bc4b-54605beebc48",
  ios: "58468414-6924-44ba-bc4b-54605beebc48",
  web: "5b23db71-4a9f-4ae3-9f91-2e5745263ec1",
  fullstack: "5b23db71-4a9f-4ae3-9f91-2e5745263ec1",
  qa: "e6af36f6-6234-4e05-b48c-8b987b57a9eb",
  devops: "d1618b1e-bbf3-4fa2-9b4b-89fd343e6456",
  data: "f534b34c-225c-40d8-ac27-aadff06d998b",
  graphic: "111b86ff-5e30-4cf4-ba98-087b3ca77d4a",
};

const POSITION_HINTS: Array<{
  key: string;
  needles: string[];
}> = [
  { key: "frontend", needles: ["frontend", "front-end"] },
  { key: "backend", needles: ["backend", "back-end"] },
  { key: "design", needles: ["uiux", "ui/ux", "ux", "design", "designer", "graphic"] },
  { key: "product", needles: ["product", "pm"] },
  { key: "gamedev", needles: ["game", "gamedev"] },
  { key: "mobile", needles: ["mobile", "android", "ios"] },
  { key: "web", needles: ["web", "fullstack", "full-stack"] },
  { key: "qa", needles: ["qa", "test"] },
  { key: "devops", needles: ["devops"] },
  { key: "data", needles: ["data", "ml", "machine learning"] },
];

function normalizeLookupKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[^a-z0-9а-я]+/giu, "");
}

function dedupe<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function collectSelectedTagValues(data: RegisterFormData): string[] {
  return dedupe(
    (data.skills ?? [])
      .map((label) => {
        const normalizedLabel = normalizeLookupKey(label);
        return TAG_VALUE_BY_LABEL.get(normalizedLabel) ?? normalizedLabel;
      })
      .filter(Boolean),
  );
}

function resolveSpecializationKeys(data: RegisterFormData): string[] {
  const values = new Set<string>();
  const candidates = [
    data.position,
    ...collectSelectedTagValues(data),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeLookupKey(candidate);
    for (const { key, needles } of POSITION_HINTS) {
      if (needles.some((needle) => normalized.includes(needle))) {
        values.add(key);
      }
    }

    if (SPECIALIZATION_ID_BY_KEY[normalized]) {
      values.add(normalized);
    }
  }

  return Array.from(values);
}

function resolveSkillCandidates(data: RegisterFormData): string[] {
  const specializationKeys = new Set(resolveSpecializationKeys(data));
  const skillCandidates: string[] = [];

  for (const label of data.skills ?? []) {
    const normalizedLabel = normalizeLookupKey(label);
    const canonicalValue = TAG_VALUE_BY_LABEL.get(normalizedLabel) ?? normalizedLabel;
    const normalizedCanonical = normalizeLookupKey(canonicalValue);

    if (specializationKeys.has(normalizedCanonical)) {
      continue;
    }

    skillCandidates.push(label, canonicalValue);
  }

  return dedupe(skillCandidates.map(normalizeLookupKey).filter(Boolean));
}

function resolveCatalogId(
  candidates: string[],
  catalog: SkillCatalogItem[],
): string | null {
  const normalizedCatalog = catalog.map((item) => ({
    id: item.id,
    name: item.name,
    key: normalizeLookupKey(item.name),
  }));

  for (const candidate of candidates) {
    const key = normalizeLookupKey(candidate);
    if (!key) continue;

    const exact = normalizedCatalog.find((item) => item.key === key);
    if (exact) {
      return exact.id;
    }
  }

  for (const candidate of candidates) {
    const key = normalizeLookupKey(candidate);
    if (!key) continue;

    const matches = normalizedCatalog
      .filter(
        (item) =>
          item.key.includes(key) ||
          key.includes(item.key),
      )
      .sort((a, b) => a.name.length - b.name.length);

    if (matches.length > 0) {
      return matches[0].id;
    }
  }

  return null;
}

function resolveSkills(data: RegisterFormData, catalog: SkillCatalogItem[]) {
  const candidates = resolveSkillCandidates(data);
  const selectedSkillIds: string[] = [];

  for (const skillName of candidates) {
    const match = resolveCatalogId([skillName], catalog);
    if (match) {
      selectedSkillIds.push(match);
    }
  }

  return dedupe(selectedSkillIds).map((skill_id) => ({ skill_id }));
}

function resolveSpecializations(data: RegisterFormData) {
  const keys = resolveSpecializationKeys(data);

  return dedupe(
    keys
      .map((key) => SPECIALIZATION_ID_BY_KEY[key])
      .filter((id): id is string => Boolean(id)),
  ).map((spec_id) => ({ spec_id }));
}

function resolveWorkformats(format?: string) {
  const normalized = format ? normalizeLookupKey(format) : "";
  const workformatId = WORKFORMAT_ID_BY_VALUE[normalized];

  return workformatId ? [{ format_id: workformatId }] : [];
}

export function buildProfileUpdatePayload(
  data: RegisterFormData,
  catalog: SkillCatalogItem[],
  avatarUrl = "",
): ProfileUpdateRequest {
  return {
    first_name: data.name.trim(),
    last_name: data.surname.trim(),
    projects_relation: data.employmentRole,
    phone_number: "",
    additional_contact: "",
    country: data.country?.trim() ?? "",
    city: data.city?.trim() ?? "",
    soft_skills: (data.qualities ?? [])
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", "),
    about_me: data.about.trim(),
    avatar_url: avatarUrl,
    skills: resolveSkills(data, catalog),
    specializations: resolveSpecializations(data),
    workformats: resolveWorkformats(data.format),
  };
}
