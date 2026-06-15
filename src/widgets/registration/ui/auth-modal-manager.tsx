import { useEffect } from "react";
import { useModal } from "@/shared/lib/hooks/use-modal";
import RegistrationModal from "./registration-modal";
import { LoginModal } from "@/features/login-modal";
import {
  type AuthAction,
  subscribeAuthModalActions,
} from "../model/auth-modal-actions";

interface AuthModalManagerProps {
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
        onOpenChange={(v: boolean) => register.setOpen(v)}
        onOpenLogin={openLoginFromRegister}
      />

      <LoginModal
        open={login.open}
        onOpenChange={(v: boolean) => login.setOpen(v)}
        onOpenRegister={openRegisterFromLogin}
      />
    </>
  );
}

export default AuthModalManager;
