import { Navigate, useLocation } from "react-router";
import { useIsAuthed } from "@/shared/lib/auth/use-is-authed";
import { ROUTES } from "@/shared/model/routes";

function LoginPage() {
  const isAuthed = useIsAuthed();
  const location = useLocation();
  
  // Если уже авторизован → редирект на главную или на запрошенный URL
  if (isAuthed) {
    const from = location.state?.from || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      {/* Компонент логина */}
    </div>
  );
}

export const Component = LoginPage;