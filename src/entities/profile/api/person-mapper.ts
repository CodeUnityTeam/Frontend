import type { Person } from "@/entities/profile/model/types";

export interface PersonDto {
  pk: string;
  first_name: string;
  last_name: string;
  city: string;
  avatar_url: string;
  is_liked: boolean;
  rating: number;
  skills: { skill_id?: string; name?: string }[];
  specializations: { spec_id?: string; name?: string }[];
  workformats: { format_id?: string; name?: string }[];
}

const INTERNAL_MINIO_PREFIX = /^https?:\/\/minio:\d+\//;
const PUBLIC_MEDIA_BASE = "https://dev.code-unity.ru/media/";

function normalizeAvatarUrl(url: string | null | undefined): string {
  if (!url) {
    return "";
  }
  return url.replace(INTERNAL_MINIO_PREFIX, PUBLIC_MEDIA_BASE);
}

export function mapPerson(dto: PersonDto): Person {
  return {
    userId: dto.pk,
    firstName: dto.first_name,
    lastName: dto.last_name,
    city: dto.city ?? "",
    avatarUrl: normalizeAvatarUrl(dto.avatar_url),
    isLiked: dto.is_liked,
    rating: dto.rating ?? 0,
    skills: (dto.skills ?? [])
      .filter((skill) => Boolean(skill.name))
      .map((skill) => ({
        skillId: skill.skill_id ?? "",
        name: skill.name ?? "",
      })),
    specializations: (dto.specializations ?? [])
      .filter((spec) => Boolean(spec.name))
      .map((spec) => ({ specId: spec.spec_id ?? "", name: spec.name ?? "" })),
    workformats: (dto.workformats ?? [])
      .filter((format) => Boolean(format.name))
      .map((format) => ({
        formatId: format.format_id ?? "",
        name: format.name ?? "",
      })),
  };
}
