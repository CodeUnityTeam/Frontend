import { useState, useEffect } from "react";

import { Modal } from "@/shared/ui/modal/modal";
import { Icon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/sheet/sheet";
import { Controller, useForm } from "react-hook-form";
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
import { useDocuments } from "@/entities/document";

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

  const { data: documents } = useDocuments();

  useEffect(() => {
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
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      consent: false,
    },
  });

  const consentValue = watch("consent");

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
            password: values.password,
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
      window.location.assign(url);
    } catch {
      toast.error("Не удалось начать аутентификацию провайдера");
      setProviderLoading(false);
    }
  };

  const documentsArray = Array.isArray(documents) ? documents : [];
  const privacyPolicy = documentsArray.find(doc => doc.slug === "personal_data_processing");
  const platformRules = documentsArray.find(doc => doc.slug === "platform_rules");
  const privacyPolicyFull = documentsArray.find(doc => doc.slug === "privacy_policy");

  const renderContent = () => (
    <>
      <div className="flex flex-col items-center gap-1 text-center">
        <DialogTitle className="text-2xl font-semibold tracking-normal text-foreground sm:text-3xl">
          Регистрация
        </DialogTitle>
        <DialogDescription className="text-[16px] text-foreground">
          Регистрация профиля
        </DialogDescription>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full max-w-[480px] grid-cols-1 gap-3 md:grid-cols-2"
      >
        <div>
          <Input
            label="Имя"
            placeholder="Введите имя"
            {...register("firstName")}
            error={errors.firstName?.message}
            className="h-[52px] rounded-lg border-[#C9CBD8]"
          />
        </div>

        <div>
          <Input
            label="Фамилия"
            placeholder="Введите фамилию"
            {...register("lastName")}
            error={errors.lastName?.message}
            className="h-[52px] rounded-lg border-[#C9CBD8]"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="E-mail"
            placeholder="Введите E-mail"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            className="h-[52px] rounded-lg border-[#C9CBD8]"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Пароль"
            placeholder="Введите пароль"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={errors.password?.message}
            className="h-[52px] rounded-lg border-[#C9CBD8]"
            rightElement={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setShowPassword((s) => !s)}
              >
                <Icon name={showPassword ? "ph:eye-slash" : "ph:eye"} />
              </Button>
            }
          />
        </div>

        <div className="md:col-span-2">
          <Controller
            name="consent"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-2 border-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground"
                  />
                  <label
                    htmlFor="consent"
                    className="mt-0.5 cursor-pointer text-sm leading-relaxed text-muted-foreground"
                  >
                    Соглашаюсь на{" "}
                    <a
                      href={privacyPolicy?.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-primary underline hover:no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      обработку персональных данных
                    </a>
                    {platformRules && (
                      <>
                        ,{" "}
                        <a
                          href={platformRules.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-primary underline hover:no-underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          правила пользования платформой
                        </a>
                      </>
                    )}
                    {privacyPolicyFull && (
                      <>
                        {" "}
                        и{" "}
                        <a
                          href={privacyPolicyFull.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-primary underline hover:no-underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          политику конфиденциальности
                        </a>
                      </>
                    )}
                  </label>
                </div>
                {fieldState.error && (
                  <p className="text-xs text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="md:col-span-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={
              !consentValue || mutation.status === "pending" || isSubmitting || !isValid
            }
          >
            {mutation.status === "pending" || isSubmitting ? (
              <>
                <Icon name="ph:spinner" className="mr-1.5 animate-spin" />
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 flex w-full flex-col items-center gap-4">
        <div className="h-px w-full bg-primary/70" />

        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Войти через Яндекс"
            onClick={() => handleProvider("yandex")}
            disabled={providerLoading}
            className="p-0 transition-opacity hover:opacity-80 [&_svg]:size-8"
          >
            <Icon name="yandex" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Войти через Mail.ru"
            onClick={() => handleProvider("mailru")}
            disabled={providerLoading}
            className="p-0 transition-opacity hover:opacity-80 [&_svg]:size-8"
          >
            <Icon name="mail-ru" />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="font-normal text-foreground hover:text-primary"
          onClick={() => {
            onOpenChange(false);
            onOpenLogin?.();
          }}
        >
          Уже есть профиль?
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showClose className="h-full">
          <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto px-[4%] pt-4 pb-4">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold tracking-normal text-foreground">
                Регистрация
              </SheetTitle>
              <SheetDescription className="text-[16px] text-foreground">
                Регистрация профиля
              </SheetDescription>
            </SheetHeader>

            <div className="w-full mt-1">
              {renderContent()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-145 gap-0 p-4 sm:px-12 sm:py-8 h-auto"
    >
      <div className="flex w-full flex-col items-center gap-2 max-h-[90vh] overflow-y-auto">
        <div className="flex w-full justify-end">
          <DialogClose
            aria-label="Закрыть"
            className="flex cursor-pointer text-foreground transition-opacity hover:opacity-70"
          >
            <Icon name="ph:x" size={20} />
          </DialogClose>
        </div>

        {renderContent()}
      </div>
    </Modal>
  );
}

export default RegistrationModal;
