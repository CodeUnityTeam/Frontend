import { ROUTES } from "@/shared/model/routes";

export function handleHttpError(error: any, navigate: any) {
  if (error?.response?.status === 401) {
    
    localStorage.removeItem("ku_access");
    localStorage.removeItem("ku_refresh");
    
    navigate(ROUTES.LOGIN, { replace: true });
    return true;
  }
  
  if (error?.response?.status === 403) {
    navigate("/403", { replace: true });
    return true;
  }
  
  if (error?.response?.status === 500) {
    navigate("/500", { replace: true });
    return true;
  }
  
  return false;
}