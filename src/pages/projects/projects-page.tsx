import { Navigate } from "react-router";
import { isAuth } from "@/shared/config/mock-config";
import { ROUTES } from "@/shared/model/routes";

function ProjectsPage() {
  if (!isAuth) {
    return <Navigate to={ROUTES.REGISTER} replace />;
  }

  return <div>Projects page</div>;
}

export const Component = ProjectsPage;