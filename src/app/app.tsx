import { Header } from "@/widgets/header";
import { Outlet, useNavigate } from "react-router";
import { Footer } from "@/widgets/footer";
import { Providers } from "./providers";
import AuthModalManager from "@/widgets/registration/ui/auth-modal-manager";
import { Suspense, useEffect } from "react";
import { useIsAuthed } from "@/shared/lib/auth";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";
import { LoginModal } from "@/features/login-modal/ui/login-modal";
import { openAuthRegister } from "@/widgets/registration/model/auth-modal-actions";

export function App() {
  const { isOpen, closeModal, openModal, redirectPath, clearRedirectPath } = useAuthModalStore();
  const isAuthed = useIsAuthed();
  const navigate = useNavigate();

  // Обработчик 401 ошибок
  useEffect(() => {
    const handleOpenLoginModal = () => {
      openModal();
    };

    window.addEventListener("open-login-modal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLoginModal);
    };
  }, [openModal]);

  useEffect(() => {
    if (!isOpen && isAuthed && redirectPath) {
      navigate(redirectPath, { replace: true });
      clearRedirectPath();
    }
  }, [clearRedirectPath, isAuthed, isOpen, navigate, redirectPath]);

  const handleModalClose = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Providers>
      <AuthModalManager />
      <LoginModal
        open={isOpen}
        onOpenChange={handleModalClose}
        onOpenRegister={openAuthRegister}
      />
      <div className="flex min-h-svh flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Suspense fallback={<div>Загрузка...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
