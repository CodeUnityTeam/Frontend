import { useMutation } from "@tanstack/react-query";

import {
  createExperience,
  updateCurrentUserProfile,
  uploadCurrentUserAvatar,
  type ExperienceCreateRequest,
} from "@/shared/api/profile";
import {
  buildProfileUpdatePayload,
  type OnboardingCatalogs,
} from "@/pages/register/model/onboarding-profile-update-payload";
import type { RegisterFormData } from "@/pages/register/model/use-register-form";

interface FinishOnboardingVars {
  data: RegisterFormData;
  catalogs: OnboardingCatalogs;
}

function collectExperiencePayloads(
  data: RegisterFormData,
): ExperienceCreateRequest[] {
  const payloads: ExperienceCreateRequest[] = [];

  for (const entry of data.experiences ?? []) {
    const company = entry.company.trim();
    const position = entry.position.trim();
    const startDate = entry.startDate?.trim() ?? "";
    if (!company || !position || !startDate) {
      continue;
    }

    payloads.push({
      company,
      position,
      responsibilities: entry.responsibilities.trim(),
      start_date: startDate,
      end_date: entry.endDate?.trim() ? entry.endDate.trim() : null,
    });
  }

  return payloads;
}

async function finishOnboarding({ data, catalogs }: FinishOnboardingVars) {
  if (data.photo) {
    await uploadCurrentUserAvatar(data.photo);
  }

  await updateCurrentUserProfile(buildProfileUpdatePayload(data, catalogs));

  for (const payload of collectExperiencePayloads(data)) {
    await createExperience(payload);
  }
}

export function useFinishOnboarding() {
  return useMutation({ mutationFn: finishOnboarding });
}
