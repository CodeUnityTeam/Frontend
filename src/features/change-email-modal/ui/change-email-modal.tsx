import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

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
  type ChangeEmailFormValues,
  changeEmailSchema,
} from "@/features/change-email-modal/model/change-email-schema";
import { useChangeEmailMutation } from "@/features/change-email-modal/model/use-change-email-mutation";

interface ChangeEmailModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChangeEmailModal({
  open,
  onOpenChange,
}: ChangeEmailModalProps) {
  const { mutate, isPending } = useChangeEmailMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isSubmitted, isValid },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    mode: "onTouched",
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) reset();
    onOpenChange?.(value);
  };

  const onSubmit = (values: ChangeEmailFormValues) => {
    mutate(values.newEmail, {
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
          <Icon icon="ph:envelope-simple" height="64" />
          <div className="flex flex-col gap-1 text-center">
            <DialogTitle className="text-[26px] leading-8 font-bold">
              Изменить E-mail
            </DialogTitle>
            <DialogDescription className="text-center text-base text-foreground">
              Новый адрес станет вашим логином для входа в аккаунт
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <Input
            label="Новый E-mail"
            placeholder="Введите новый E-mail"
            type="email"
            className="h-14"
            {...register("newEmail")}
            error={
              touchedFields.newEmail || isSubmitted
                ? errors.newEmail?.message
                : undefined
            }
          />

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
