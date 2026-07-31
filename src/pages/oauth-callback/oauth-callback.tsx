import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { setTokens } from "@/shared/lib/auth/token-storage";
import { ROUTES } from "@/shared/model/routes";

const USER_ID_KEY = "ku_user_id";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const access = searchParams.get("access");
  const refresh = searchParams.get("refresh");
  const userId = searchParams.get("user_id");

  useEffect(() => {
    if (!access || !refresh) {
      console.warn("OAuth callback: missing access or refresh token");
      navigate(ROUTES.HOME);
      return;
    }

    // Сохраняем токены через существующий API
    setTokens({ access, refresh });

    // Отдельно сохраняем user_id (если есть)
    try {
      if (userId) {
        localStorage.setItem(USER_ID_KEY, userId);
      } else {
        localStorage.removeItem(USER_ID_KEY);
      }
    } catch {
      // localStorage недоступен (приватный режим)
    }

    // Редирект на onboarding. replace: true — чтобы нельзя было вернуться назад
    navigate(ROUTES.ONBOARDING, { replace: true });
  }, [access, refresh, userId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Обработка авторизации…</p>
      </div>
    </div>
  );
}

export const Component = OAuthCallback;