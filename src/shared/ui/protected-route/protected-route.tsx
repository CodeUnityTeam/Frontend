import { Navigate, useLocation } from "react-router";
import { useIsAuthed } from "@/shared/lib/auth/use-is-authed";
import { ROUTES } from "@/shared/model/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; 
  userRole?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  userRole = "worker" 
}: ProtectedRouteProps) {
  const isAuthed = useIsAuthed();
  const location = useLocation();

  
  if (!isAuthed) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <>{children}</>;
}