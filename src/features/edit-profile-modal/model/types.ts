import type { CurrentUserProfile } from "@/shared/api/profile";

export interface EditProfileFormData {
  firstName: string;
  lastName: string;
  position: string;
  role: "employer" | "worker";
  country: string;
  city: string;
  format: string;
}

export type UserProfileData = CurrentUserProfile;