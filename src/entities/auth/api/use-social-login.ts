import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { 
  getYandexAuthUrl, 
  getMailRuAuthUrl, 
  yandexAuth, 
  mailRuAuth,
  type SocialAuthResponse 
} from "@/shared/api/auth";
import { setTokens } from "@/shared/lib/auth";
import { ROUTES } from "@/shared/model/routes";
import { clearOAuthState, getOAuthState, saveOAuthState } from "@/shared/lib/cookies";


export function useYandexAuthUrl() {
  return useMutation({
    mutationFn: getYandexAuthUrl,
    onSuccess: (url) => {
      const state = Math.random().toString(36).substring(2, 15);
      saveOAuthState(state, "yandex");
      window.location.href = url;
    },
  });
}


export function useMailRuAuthUrl() {
  return useMutation({
    mutationFn: getMailRuAuthUrl,
    onSuccess: (url) => {
      const state = Math.random().toString(36).substring(2, 15);
      saveOAuthState(state, "mailru");
      window.location.href = url;
    },
  });
}


export function useSocialAuth() {
  const navigate = useNavigate();

  const handleSuccess = (data: SocialAuthResponse) => {
    setTokens({ access: data.access, refresh: data.refresh });
    clearOAuthState();
    navigate(ROUTES.HOME);
  };

  const yandexMutation = useMutation({
    mutationFn: (code: string) => yandexAuth(code, getOAuthState() || undefined),
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("Yandex auth error:", error);
      navigate(ROUTES.HOME);
    },
  });

  const mailRuMutation = useMutation({
    mutationFn: (code: string) => mailRuAuth(code, getOAuthState() || undefined),
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("Mail.ru auth error:", error);
      navigate(ROUTES.HOME);
    },
  });

  return {
    yandexAuth: yandexMutation.mutate,
    mailRuAuth: mailRuMutation.mutate,
    isYandexPending: yandexMutation.isPending,
    isMailRuPending: mailRuMutation.isPending,
    error: yandexMutation.error || mailRuMutation.error,
  };
}