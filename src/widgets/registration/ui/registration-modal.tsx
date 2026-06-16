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
import yandexSvg from "@/shared/assets/icons/yandex.svg";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "../model/registration-schema";
import { useRegisterMutation } from "../model/use-register-mutation";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { ROUTES } from "@/shared/model/routes";
import { getProviderUrl, type RegistrationRequest } from "@/shared/api/auth";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLogin?: () => void;
}

function getSuccessMessage(data: unknown): string {
  if (typeof data === "object" && data !== null && "detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
  }

  return "Регистрация выполнена";
}

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Серверная ошибка. Попробуйте позже";
  }

  const status =
    "status" in error ? (error as { status?: number }).status : undefined;
  const data = "data" in error ? (error as { data?: unknown }).data : undefined;

  if (status === 409) {
    return "Пользователь с таким E-mail уже существует";
  }

  if (status === 400 && data) {
    if (typeof data === "string") return data;

    if (typeof data === "object") {
      const values = Object.values(data).flat();
      const firstMessage = values.find((item) => typeof item === "string");
      if (typeof firstMessage === "string") return firstMessage;
      return JSON.stringify(data);
    }
  }

  return "Серверная ошибка. Попробуйте позже";
}

export function RegistrationModal({
  open,
  onOpenChange,
  onOpenLogin,
}: RegistrationModalProps) {
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
    const payload: RegistrationRequest = {
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      password: values.password,
    };

    mutation.mutate(payload, {
      onSuccess: (data: unknown) => {
        toast.success(getSuccessMessage(data));
        onOpenChange(false);
        navigate(ROUTES.REGISTER_CHECK_EMAIL, {
          state: {
            prefill: {
              name: values.firstName,
              surname: values.lastName,
              email: values.email,
            },
          },
        });
      },
      onError: (err: unknown) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  const handleProvider = async (providerId: string) => {
    setProviderLoading(true);
    try {
      const url = await getProviderUrl(providerId);
      if (!url) throw new Error("No url returned");
      // Redirect to provider
      window.location.assign(url);
    } catch {
      toast.error("Не удалось начать аутентификацию провайдера");
      setProviderLoading(false);
    }
  };

  const providers = [
    {
      id: "yandex",
      label: "Yandex",
      icon: yandexSvg,
    },
  ];

  const providersButtons = (
    <div className="mt-6 flex flex-col items-center gap-5">
      <div className="h-px w-full bg-primary/70" />

      <div className="flex items-center justify-center gap-4">
        {providers.map((p) => (
          <Button
            key={p.id}
            type="button"
            aria-label={p.label}
            variant="outline"
            size="icon_lg"
            className="h-12 w-12 rounded-full border-0 bg-[#252728] p-0 text-white hover:bg-[#373a3b] focus-visible:bg-[#373a3b]"
            onClick={() => handleProvider(p.id)}
            disabled={providerLoading}
          >
            <img src={p.icon} alt="" aria-hidden="true" className="h-6 w-6" />
          </Button>
        ))}
      </div>
    </div>
  );

  const form = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((s) => !s)}
            >
              <Icon icon={showPassword ? "ph:eye-slash" : "ph:eye"} />
            </Button>
          }
        />
      </div>

      <div className="md:col-span-2">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={mutation.status === "pending" || isSubmitting}
        >
          {mutation.status === "pending" || isSubmitting ? (
            <>
              <Icon icon="ph:spinner" className="mr-2 animate-spin" />
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
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto p-0 text-sm text-muted-foreground underline"
        onClick={() => {
          onOpenChange(false);
          onOpenLogin?.();
        }}
      >
        Уже есть профиль?
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showClose className="h-full">
          <div className="flex h-full flex-col px-[5%] pt-6 pb-6">
            <SheetHeader>
              <SheetTitle className="text-2xl">Регистрация</SheetTitle>
              <SheetDescription className="mt-1">
                Регистрация профиля
              </SheetDescription>
            </SheetHeader>

            <div className="mt-2 flex-1 overflow-auto">
              {form}

              <div className="mt-6">
                <div className="mb-4 text-center text-sm text-muted-foreground">
                  Зарегистрироваться через
                </div>
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
          <DialogDescription className="mt-1">
            Регистрация профиля
          </DialogDescription>
        </DialogHeader>

        {form}

        <div className="mt-6">
          <div className="mb-4 text-center text-xl text-muted-foreground"> 
            Зарегистрироваться через
          </div>
          {providersButtons}
          {switchLine}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationModal;
