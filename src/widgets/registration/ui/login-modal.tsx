import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister?: () => void;
}

export function LoginModal({ open, onOpenChange, onOpenRegister }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Вход</DialogTitle>
          <DialogDescription>Вход в профиль (заглушка)</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Модуль входа пока заглушка — реализация идёт в отдельной задаче. #44</p>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => {
              onOpenChange(false);
              onOpenRegister?.();
            }}>
              Назад к регистрации
            </Button>

            <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
