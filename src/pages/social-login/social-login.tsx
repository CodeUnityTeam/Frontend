import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSocialAuth } from "@/entities/auth";
import { ROUTES } from "@/shared/model/routes";
import { toast } from "sonner";

export function SocialLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 
  const { yandexAuth, mailRuAuth } = useSocialAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = searchParams.get("provider");

  
    if (yandexAuth === undefined || mailRuAuth === undefined || navigate === undefined || code === null) {
      return;
    }

    switch(provider) {
      case "yandex":
        yandexAuth(code);
        break;
      case "mailru":
        mailRuAuth(code)
        break;
      default:
        toast.error("Не удалось закончить авторизацию. Попробуйте позже.");
        navigate(ROUTES.HOME);
    }
    

  }, [yandexAuth, mailRuAuth, searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Обработка авторизации…</p>
      </div>
    </div>
  );
}

export const Component = SocialLogin;
