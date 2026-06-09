import React, { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/sheet/sheet";
import telegramSvg from "@/shared/assets/icons/telegram.svg";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationFormValues } from "../model/registration-schema";
import { useRegisterMutation } from "../model/use-register-mutation";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ROUTES } from "@/shared/model/routes";
import { getProviderUrl } from "@/shared/api/auth";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLogin?: () => void;
}

export function RegistrationModal({ open, onOpenChange, onOpenLogin }: RegistrationModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const navigate = useNavigate();
  const mutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: RegistrationFormValues) => {
    const payload = {
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      password: values.password,
    } as const;

    const mutatePayload: any = payload;
    mutation.mutate(mutatePayload, {
      onSuccess: (data: any) => {
        toast.success((data && (data.detail || "Регистрация выполнена")) || "Регистрация выполнена");
        onOpenChange(false);
        // Redirect to onboarding (existing register page)
        navigate(ROUTES.REGISTER);
      },
      onError: (err: any) => {
        if (err?.status === 409) {
          toast.error("Пользователь с таким E-mail уже существует");
        } else if (err?.status === 400 && err?.data) {
          const msg = typeof err.data === "string" ? err.data : (err.data.detail || JSON.stringify(err.data));
          toast.error(msg || "Проверьте данные формы");
        } else {
          toast.error("Серверная ошибка. Попробуйте позже");
        }
      },
    });
  };

  const handleProvider = async (providerId: string) => {
    setProviderLoading(true);
    try {
      const url = await getProviderUrl(providerId);
      if (!url) throw new Error("No url returned");
      // Redirect to provider
      window.location.href = url;
    } catch (e) {
      toast.error("Не удалось начать аутентификацию провайдера");
      setProviderLoading(false);
    }
  };

  const providers = [
    { id: "yandex", label: "Yandex", render: () => <span className="font-semibold">Я</span> },
    { id: "email", label: "E-mail", render: () => <span className="text-lg">@</span> },
    { id: "telegram", label: "Telegram", render: () => <img src={telegramSvg} alt="Telegram" className="h-5 w-5" /> },
  ];

  const providersButtons = (
    <div className="flex justify-center gap-4">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-label={p.label}
          className="h-10 w-10 rounded-full border flex items-center justify-center bg-white"
          onClick={() => handleProvider(p.id)}
          disabled={providerLoading}
        >
          {p.render()}
        </button>
      ))}
    </div>
  );

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <Input
          label="Имя"
          placeholder="Введите имя"
          {...register("firstName")}
          error={errors.firstName?.message}
          className="h-12 rounded-lg"
        />
      </div>

      <div>
        <Input
          label="Фамилия"
          placeholder="Введите фамилию"
          {...register("lastName")}
          error={errors.lastName?.message}
          className="h-12 rounded-lg"
        />
      </div>

      <div className="md:col-span-2">
        <Input
          label="E-mail"
          placeholder="Введите E-mail"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          className="h-12 rounded-lg"
        />
      </div>

      <div className="md:col-span-2">
        <Input
          label="Пароль"
          placeholder="Введите пароль"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={errors.password?.message}
          className="h-12 rounded-lg"
          rightElement={
            <button
              type="button"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((s) => !s)}
              className="p-2"
            >
              <Icon icon={showPassword ? "ph:eye-slash" : "ph:eye"} />
            </button>
          }
        />
      </div>

      <div className="md:col-span-2">
        <Button type="submit" size="lg" className="w-full" disabled={mutation.status === "pending" || isSubmitting}>
          {mutation.status === "pending" || isSubmitting ? (
            <>
              <Icon icon="ph:spinner" className="animate-spin mr-2" />
              Регистрация...
            </>
          ) : (
            "Зарегистрироваться"
          )}
        </Button>
      </div>
    </form>
  );

  const switchLine = (
    <div className="mt-4 text-center">
      <button
        type="button"
        className="text-sm text-muted-foreground underline"
        onClick={() => {
          onOpenChange(false);
          onOpenLogin?.();
        }}
      >
        Уже есть профиль?
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showClose className="h-full">
          <div className="h-full flex flex-col px-[5%] pt-6 pb-6">
            <SheetHeader>
              <SheetTitle className="text-2xl">Регистрация</SheetTitle>
              <SheetDescription className="mt-1">Регистрация профиля</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-auto mt-2">
              {form}

              <div className="mt-6">
                <div className="text-center text-sm text-muted-foreground mb-4">Зарегистрироваться через</div>
                {providersButtons}
                {switchLine}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Регистрация</DialogTitle>
          <DialogDescription className="mt-1">Регистрация профиля</DialogDescription>
        </DialogHeader>

        {form}

        <div className="mt-6">
          <div className="text-center text-sm text-muted-foreground mb-4">Зарегистрироваться через</div>
          {providersButtons}
          {switchLine}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationModal;
