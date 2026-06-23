// src/shared/lib/handle-http-error.ts
import { ROUTES } from "@/shared/model/routes";

export function handleHttpError(error: unknown, navigate: (to: string, options?: { replace?: boolean }) => void): boolean {
  // Проверяем, что error - объект с response
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    const status = response?.status;
    
    if (status === 401) {
      localStorage.removeItem("ku_access");
      localStorage.removeItem("ku_refresh");
      navigate(ROUTES.LOGIN, { replace: true });
      return true;
    }
    
    if (status === 403) {
      navigate("/403", { replace: true });
      return true;
    }
    
    if (status === 500) {
      navigate("/500", { replace: true });
      return true;
    }
  }
  
  return false;
}