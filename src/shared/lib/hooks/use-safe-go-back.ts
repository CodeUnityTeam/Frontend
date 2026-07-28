import { useCallback } from "react";
import { useNavigate, type To } from "react-router";

type SafeGoBackOptions = {
  fallbackTo: To;
  replaceFallback?: boolean;
};

export function useSafeGoBack({
  fallbackTo,
  replaceFallback = true,
}: SafeGoBackOptions) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: replaceFallback });
  }, [fallbackTo, navigate, replaceFallback]);
}
