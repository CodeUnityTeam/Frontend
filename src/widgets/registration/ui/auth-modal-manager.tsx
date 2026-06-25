import { useEffect } from "react";
import { useModal } from "@/shared/lib/hooks/use-modal";
import RegistrationModal from "./registration-modal";
import { LoginModal } from "@/features/login-modal";
import { ResetPasswordModal } from "@/features/reset-password";
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
  const resetPassword = useModal(false);

  useEffect(() => {
    const handler = (action: AuthAction) => {
      if (action === "openRegister") {
        login.closeModal();
        resetPassword.closeModal();
        register.openModal();
      }
      if (action === "openLogin") {
        register.closeModal();
        resetPassword.closeModal();
        login.openModal();
      }
      if (action === "closeAll") {
        register.closeModal();
        login.closeModal();
        resetPassword.closeModal();
      }
    };

    return subscribeAuthModalActions(handler);
  }, [register, login, resetPassword]);

  const openLoginFromRegister = () => {
    register.closeModal();
    login.openModal();
  };

  const openRegisterFromLogin = () => {
    login.closeModal();
    register.openModal();
  };

  const openResetPasswordFromLogin = () => {
    login.closeModal();
    resetPassword.openModal();
  };

  const returnToLoginFromResetPassword = () => {
    resetPassword.closeModal();
    login.openModal();
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
        onOpenResetPassword={openResetPasswordFromLogin}
      />

      <ResetPasswordModal
        open={resetPassword.open}
        onClose={resetPassword.closeModal}
        onBack={returnToLoginFromResetPassword}
      />
    </>
  );
}

export default AuthModalManager;
