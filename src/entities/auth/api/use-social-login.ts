import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import {
  getYandexAuthUrl,
  getMailRuAuthUrl,
  yandexAuth,
  mailRuAuth,
} from "@/shared/api/auth";
import type { SocialAuthResponse } from "@/entities/auth/model/types";
import { setTokens } from "@/shared/lib/auth";
import { ROUTES } from "@/shared/model/routes";
import {
  clearOAuthState,
  getOAuthState,
  saveOAuthState,
} from "@/shared/lib/cookies";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";
import { toast } from "sonner";

export function useYandexAuthUrl() {
  const location = useLocation();
  const { setRedirectPath } = useAuthModalStore();

  const redirectUrl = location.pathname + location.search;
  return useMutation({
    mutationFn: getYandexAuthUrl,
    onSuccess: (url) => {
      setRedirectPath(redirectUrl);
      const state = Math.random().toString(36).substring(2, 15);
      saveOAuthState(state, "yandex");
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Yandex auth url error:", error);
      toast.error("Не удалось начать авторизацию через Яндекс. Попробуйте позже.");
    },
  });
}

export function useMailRuAuthUrl() {
  const location = useLocation();
  const { setRedirectPath } = useAuthModalStore();

  const redirectUrl = location.pathname + location.search;
  return useMutation({
    mutationFn: getMailRuAuthUrl,
    onSuccess: (url) => {
      setRedirectPath(redirectUrl);
      const state = Math.random().toString(36).substring(2, 15);
      saveOAuthState(state, "mailru");
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Mail.ru auth url error:", error);
      toast.error("Не удалось начать авторизацию через Mail.ru. Попробуйте позже.");
    },
  });
}

export function useSocialAuth() {
  const navigate = useNavigate();

  const handleSuccess = (data: SocialAuthResponse) => {
    setTokens({ access: data.access, refresh: data.refresh });
    clearOAuthState();
    toast.success("Вы успешно вошли!");
    navigate(ROUTES.HOME);
  };

  const yandexMutation = useMutation({
    mutationFn: (code: string) =>
      yandexAuth(code, getOAuthState() || undefined),
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("Yandex auth error:", error);
      clearOAuthState();
      toast.error("Не удалось авторизоваться через Яндекс. Попробуйте позже.");
      navigate(ROUTES.HOME);
    },
  });

  const mailRuMutation = useMutation({
    mutationFn: (code: string) =>
      mailRuAuth(code, getOAuthState() || undefined),
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("Mail.ru auth error:", error);
      clearOAuthState();
      toast.error("Не удалось авторизоваться через Mail.ru. Попробуйте позже.");
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
