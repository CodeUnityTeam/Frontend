import { AxiosError } from "axios";
import { ROUTES } from "@/shared/model/routes";
import { clearTokens } from "@/shared/lib/auth"; // ✅ используем единую функцию

interface HandleErrorOptions {
  navigate: (to: string, options?: { replace?: boolean }) => void;
  openLoginModal?: () => void;
}

export function handleHttpError(
  error: unknown,
  options: HandleErrorOptions
): boolean {
  const { navigate, openLoginModal } = options;
  
  if (isAxiosError(error)) {
    const status = error.response?.status;
    
    if (status === 401) {
      clearTokens(); 
      
      if (openLoginModal) {
        openLoginModal();
      } else {
        navigate(ROUTES.LOGIN, { replace: true });
      }
      return true;
    }
    
    if (status === 403) {
      navigate(ROUTES.FORBIDDEN, { replace: true });
      return true;
    }
    
    if (status === 500) {
      navigate(ROUTES.SERVER_ERROR, { replace: true });
      return true;
    }
  }
  
  return false;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    error !== null &&
    typeof error === "object" &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}