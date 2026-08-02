import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { useFormats } from "@/entities/reference";
import { useSkills } from "@/entities/skill";
import { ROUTES } from "@/shared/model/routes";
import {
  useRegisterForm,
  type RegisterFormData,
} from "@/pages/register/model/use-register-form";
import { useFinishOnboarding } from "@/pages/register/model/use-finish-onboarding";
import { OnboardingLayout } from "./register-layout";
import { OnboardingStep1 } from "./step-meet-me";
import { OnboardingStep2 } from "./step-skills";
import { OnboardingStep3 } from "./step-experience";
import { OnboardingStep4 } from "./step-about";
import type { OnboardingPrefill } from "@/shared/api/profile";

type RegisterLocationState = {
  prefill?: OnboardingPrefill;
};

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = (location.state as RegisterLocationState | null | undefined)
    ?.prefill;
  const { state, next, back, patch } = useRegisterForm({
    name: stateData?.name ?? "",
    surname: stateData?.surname ?? "",
    email: stateData?.email ?? "",
    photoUrl: stateData?.avatarUrl ?? "",
  });

  const skillsQuery = useSkills();
  const formatsQuery = useFormats();
  const finishOnboarding = useFinishOnboarding();

  const handleFinish = (finishPatch: Partial<RegisterFormData>) => {
    if (finishOnboarding.isPending) {
      return;
    }

    finishOnboarding.mutate(
      {
        data: { ...state.data, ...finishPatch },
        catalogs: {
          skills: skillsQuery.data ?? [],
          formats: formatsQuery.data ?? [],
        },
      },
      {
        onSuccess: () => {
          toast.success("Профиль заполнен");
          navigate(ROUTES.PROFILE);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <OnboardingLayout step={state.step}>
      {state.step === 1 && (
        <OnboardingStep1 data={state.data} onNext={next} onPatch={patch} />
      )}
      {state.step === 2 && (
        <OnboardingStep2
          data={state.data}
          onNext={next}
          onBack={back}
          onPatch={patch}
        />
      )}
      {state.step === 3 && (
        <OnboardingStep3
          data={state.data}
          onNext={next}
          onBack={back}
          onPatch={patch}
        />
      )}
      {state.step === 4 && (
        <OnboardingStep4
          data={state.data}
          onNext={handleFinish}
          onBack={back}
          onPatch={patch}
          isSubmitting={finishOnboarding.isPending}
        />
      )}
    </OnboardingLayout>
  );
}

export const Component = RegisterPage;
