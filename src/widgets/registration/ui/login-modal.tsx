import { useNavigate } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/model/routes";
import { onboardingPrefill } from "@/shared/config/mock-config";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister?: () => void;
}

export function LoginModal({
  open,
  onOpenChange,
  onOpenRegister,
}: LoginModalProps) {
  const navigate = useNavigate();

  const handleOpenOnboarding = () => {
    onOpenChange(false);
    navigate(ROUTES.REGISTER, {
      state: {
        prefill: onboardingPrefill,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-6 p-8" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Вход
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-foreground/70">
            Вход в профиль (заглушка)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm leading-6 text-foreground/80">
            Модуль входа пока заглушка. Для эмуляции нового пользователя можно
            перейти в 4-шаговый onboarding.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                onOpenRegister?.();
              }}
            >
              Назад к регистрации
            </Button>

            <Button className="w-full" onClick={handleOpenOnboarding}>
              Перейти к onboarding
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
