import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  buildOnboardingPrefill,
  getCurrentUserProfile,
} from "@/shared/api/profile";
import { clearOAuthState } from "@/shared/lib/cookies";
import { clearTokens, setTokens } from "@/shared/lib/auth";
import { ROUTES } from "@/shared/model/routes";
import { toast } from "sonner";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const access = searchParams.get("access");
  const refresh = searchParams.get("refresh");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  useEffect(() => {
    let cancelled = false;

    const handleCallback = async () => {
      if (error || errorCode) {
        clearOAuthState();
        toast.error("Не удалось завершить авторизацию. Попробуйте еще раз.");
        navigate(ROUTES.HOME, { replace: true });
        return;
      }

      if (!access || !refresh) {
        clearOAuthState();
        toast.error("Не удалось завершить авторизацию. Попробуйте еще раз.");
        navigate(ROUTES.HOME, { replace: true });
        return;
      }

      setTokens({ access, refresh });

      try {
        const profile = await getCurrentUserProfile();

        if (cancelled) {
          return;
        }

        if (typeof profile.onboarding_completed !== "boolean") {
          throw new Error("Missing onboarding status");
        }

        clearOAuthState();
        navigate(
          profile.onboarding_completed ? ROUTES.HOME : ROUTES.ONBOARDING,
          {
            replace: true,
            state: profile.onboarding_completed
              ? undefined
              : { prefill: buildOnboardingPrefill(profile) },
          },
        );
      } catch {
        if (cancelled) {
          return;
        }

        clearOAuthState();
        clearTokens();
        toast.error("Не удалось загрузить профиль. Попробуйте еще раз.");
        navigate(ROUTES.HOME, { replace: true });
      }
    };

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [access, error, errorCode, navigate, refresh]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Обработка авторизации…</p>
      </div>
    </div>
  );
}

export const Component = OAuthCallback;
