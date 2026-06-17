import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../model/change-password-schema";
import { useChangePasswordMutation } from "@/features/change-password-modal/model/use-change-password-mutation.ts";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {mutate, isPending} = useChangePasswordMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isSubmitted, isValid },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
    onOpenChange?.(value);
  };

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate(values.newPassword, {
      onSuccess: () => handleOpenChange(false),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex w-full max-w-88.25 flex-col gap-5 rounded-lg px-8 pt-6 pb-5 sm:rounded-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <Icon icon="ph:password" height="64" />
          <div className="flex flex-col gap-1 text-center">
            <DialogTitle className="text-[26px] font-bold leading-8">
              Изменить пароль
            </DialogTitle>
            <DialogDescription className="text-base text-foreground text-center">
              После смены пароля вам потребуется заново войти в аккаунт на всех
              ваших устройствах
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Input
              label="Текущий пароль"
              placeholder="Введите пароль"
              type={showCurrentPassword ? "text" : "password"}
              className="h-14"
              {...register("currentPassword")}
              error={(touchedFields.currentPassword || isSubmitted) ? errors.currentPassword?.message : undefined}
              rightElement={
                <button
                  type="button"
                  aria-label={
                    showCurrentPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="text-gray flex cursor-pointer transition-colors hover:text-foreground"
                >
                  <Icon
                    icon={showCurrentPassword ? "ph:eye-slash" : "ph:eye"}
                    height={24}
                  />
                </button>
              }
            />
            <Input
              label="Новый пароль"
              placeholder="Введите новый пароль"
              type={showNewPassword ? "text" : "password"}
              className="h-14"
              {...register("newPassword")}
              error={(touchedFields.newPassword || isSubmitted) ? errors.newPassword?.message : undefined}
              rightElement={
                <button
                  type="button"
                  aria-label={
                    showNewPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="text-gray flex cursor-pointer transition-colors hover:text-foreground"
                >
                  <Icon
                    icon={showNewPassword ? "ph:eye-slash" : "ph:eye"}
                    height={24}
                  />
                </button>
              }
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={!isValid || isPending}
            >
              Изменить
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
            >
              Отменить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const Component = ChangePasswordModal;
