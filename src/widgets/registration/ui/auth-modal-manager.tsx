import React, { useEffect } from "react";
import { useModal } from "@/shared/lib/hooks/use-modal";
import RegistrationModal from "./registration-modal";
import LoginModal from "./login-modal";

type AuthAction = "openRegister" | "openLogin" | "closeAll";

const listeners: Array<(action: AuthAction) => void> = [];

export function openAuthRegister() {
  listeners.forEach((l) => l("openRegister"));
}

export function openAuthLogin() {
  listeners.forEach((l) => l("openLogin"));
}

export function closeAuthModals() {
  listeners.forEach((l) => l("closeAll"));
}

interface AuthModalManagerProps {
  /** If true, open registration modal on mount */
  initialOpen?: boolean;
}

export function AuthModalManager({ initialOpen = false }: AuthModalManagerProps) {
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

    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
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
