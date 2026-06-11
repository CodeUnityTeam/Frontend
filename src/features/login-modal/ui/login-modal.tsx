import { Modal } from "@/shared/ui/modal/modal";
import { Icon } from "@/shared/ui/icon";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { LoginForm } from "./login-form";
import { SocialLogin } from "./social-login";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-145 gap-0 p-5 sm:px-15 sm:py-12"
    >
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex w-full justify-end">
          <DialogClose
            aria-label="Закрыть"
            className="flex cursor-pointer text-foreground transition-opacity hover:opacity-70"
          >
            <Icon name="ph:x" size={24} />
          </DialogClose>
        </div>

        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <DialogTitle className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Вход в профиль
          </DialogTitle>
          <DialogDescription className="text-[18px] text-foreground">
            Войдите, чтобы продолжить
          </DialogDescription>
        </div>

        <LoginForm onSuccess={handleSuccess} />

        <SocialLogin />

        <button
          type="button"
          onClick={() => alert("Раздел в разработке")}
          className="cursor-pointer text-[14px] text-foreground transition-colors hover:text-primary"
        >
          Забыли пароль?
        </button>
      </div>
    </Modal>
  );
}
