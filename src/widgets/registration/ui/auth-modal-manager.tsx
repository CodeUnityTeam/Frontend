import { useEffect } from "react";
import { useModal } from "@/shared/lib/hooks/use-modal";
import RegistrationModal from "./registration-modal";
import LoginModal from "./login-modal";
import {
  type AuthAction,
  subscribeAuthModalActions,
} from "../model/auth-modal-actions";

interface AuthModalManagerProps {
  /** If true, open registration modal on mount */
  initialOpen?: boolean;
}

export function AuthModalManager({
  initialOpen = false,
}: AuthModalManagerProps) {
  const register = useModal(initialOpen);
  const login = useModal(false);

  useEffect(() => {
    const handler = (action: AuthAction) => {
      if (action === "openRegister") {
        login.closeModal();
        register.openModal();
      }
      if (action === "openLogin") {
        register.closeModal();
        login.openModal();
      }
      if (action === "closeAll") {
        register.closeModal();
        login.closeModal();
      }
    };

    return subscribeAuthModalActions(handler);
  }, [register, login]);

  const openLoginFromRegister = () => {
    register.closeModal();
    login.openModal();
  };

  const openRegisterFromLogin = () => {
    login.closeModal();
    register.openModal();
  };

  return (
    <>
      <RegistrationModal
        open={register.open}
        onOpenChange={(v) => register.setOpen(v)}
        onOpenLogin={openLoginFromRegister}
      />

      <LoginModal
        open={login.open}
        onOpenChange={(v) => login.setOpen(v)}
        onOpenRegister={openRegisterFromLogin}
      />
    </>
  );
}

export default AuthModalManager;
