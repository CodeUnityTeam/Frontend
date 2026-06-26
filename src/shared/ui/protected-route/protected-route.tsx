import { useEffect } from "react";
import { useLocation } from "react-router";
import { useIsAuthed } from "@/shared/lib/auth/use-is-authed";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthed = useIsAuthed();
  const location = useLocation();
  const { openModal, setRedirectPath } = useAuthModalStore();

  useEffect(() => {
    if (!isAuthed) {
      // Сохраняем путь для редиректа после логина
      setRedirectPath(location.pathname + location.search);
      // Открываем модалку
      openModal();
    }
  }, [isAuthed, location, openModal, setRedirectPath]);

  // Если не авторизован - показываем null, модалка откроется
  if (!isAuthed) {
    return null;
  }

  return <>{children}</>;
}