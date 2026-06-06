import { useRegisterForm } from "../model/use-register-form";
import { OnboardingLayout } from "./register-layout";
import { OnboardingStep1 } from "./step-meet-me";
import { OnboardingStep2 } from "./step-skills";
import { OnboardingStep3 } from "./step-experience";
import { OnboardingStep4 } from "./step-about";

function RegisterPage() {
  const { state, next, back, patch } = useRegisterForm();

  const handleFinish = (patch: Parameters<typeof next>[0]) => {
    // TODO: submit assembled state.data + patch to API
    console.log("Registration complete", { ...state.data, ...patch });
  };

  return (
    <OnboardingLayout step={state.step}>
      {state.step === 1 && (
        <OnboardingStep1 data={state.data} onNext={next} onPatch={patch} />
      )}
      {state.step === 2 && (
        <OnboardingStep2 data={state.data} onNext={next} onBack={back} onPatch={patch} />
      )}
      {state.step === 3 && (
        <OnboardingStep3 data={state.data} onNext={next} onBack={back} onPatch={patch} />
      )}
      {state.step === 4 && (
        <OnboardingStep4 data={state.data} onNext={handleFinish} onBack={back} onPatch={patch} />
      )}
    </OnboardingLayout>
  );
}

export const Component = RegisterPage;
