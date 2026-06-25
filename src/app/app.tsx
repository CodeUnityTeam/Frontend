import { Header } from "@/widgets/header";
import { Outlet, useNavigate } from "react-router";
import { Footer } from "@/widgets/footer";
import { Providers } from "./providers";
import AuthModalManager from "@/widgets/registration/ui/auth-modal-manager";
import { Suspense, useEffect } from "react";
import { useAuthModalStore } from "@/shared/store/auth-modal-store";
import { LoginModal } from "@/features/login-modal/ui/login-modal";

export function App() {
  const { isOpen, closeModal, openModal, redirectPath, clearRedirectPath } = useAuthModalStore();
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

  const handleOpenRegister = () => {
    navigate("/register");
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      closeModal();
      // Если есть сохраненный путь, редирект на него
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        clearRedirectPath();
      }
    }
  };

  return (
    <Providers>
      <AuthModalManager />
      <LoginModal
        open={isOpen}
        onOpenChange={handleModalClose}
        onOpenRegister={handleOpenRegister}
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