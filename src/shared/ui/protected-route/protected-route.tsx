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

  const redirectUrl = location.pathname + location.search;

  useEffect(() => {
    if (!isAuthed) {
      setRedirectPath(redirectUrl);
      openModal();
    }
  }, [isAuthed, redirectUrl, openModal, setRedirectPath]);

  if (!isAuthed) {
    return null;
  }

  return <>{children}</>;
}