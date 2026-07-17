import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useSocialAuth } from "@/entities/auth";
import { getOAuthProvider } from "@/shared/lib/cookies";
import { ROUTES } from "@/shared/model/routes";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    yandexAuth, 
    mailRuAuth, 
    isYandexPending, 
    isMailRuPending 
} = useSocialAuth();

  const code = searchParams.get("code");
  const provider = getOAuthProvider();

  useEffect(() => {
    if (!code) {
      navigate(ROUTES.HOME);
      return;
    }

    if (provider === "yandex") {
      yandexAuth(code);
    } else if (provider === "mailru") {
      mailRuAuth(code);
    } else {
      navigate(ROUTES.HOME);
    }
  }, [code, provider, yandexAuth, mailRuAuth, navigate]);

  if (isYandexPending || isMailRuPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Авторизация через {provider}...</p>
        </div>
      </div>
    );
  }

  return null;
}

export const Component = OAuthCallback;