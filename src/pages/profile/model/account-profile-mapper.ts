import type {
  CurrentUserProfile,
  ProfileExperienceItem,
} from "@/shared/api/profile";
import type { AccountProfileProps, ExperienceItem } from "@/widgets/account";

function formatMonthYear(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const month = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(
    date,
  );
  return `${month[0].toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

function mapExperience(item: ProfileExperienceItem): ExperienceItem {
  return {
    company: item.company,
    position: item.position,
    responsibilities: item.responsibilities,
    from: formatMonthYear(item.start_date),
    to: item.end_date ? formatMonthYear(item.end_date) : undefined,
  };
}

export function buildAccountProfileProps(
  profile: CurrentUserProfile,
): AccountProfileProps {
  return {
    profile: {
      avatar: profile.avatar_url,
      name: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
      role: profile.specializations[0]?.name,
      location: [profile.city, profile.country].filter(Boolean).join(", "),
    },
    skills: profile.skills.map((skill) => skill.name),
    qualities: profile.soft_skills
      .split(",")
      .map((quality) => quality.trim())
      .filter(Boolean),
    about: profile.about_me,
    experience: profile.experiences.map(mapExperience),
  };
}
