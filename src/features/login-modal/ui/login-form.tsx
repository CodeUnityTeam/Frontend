import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/input";
import { useLogin, type LoginCredentials } from "@/entities/auth";
import { ROUTES } from "@/shared/model/routes";
import { useNavigate } from "react-router";
import { emailRules, passwordRules } from "../model/validation";

interface LoginFormProps {
  onSuccess: () => void;
  onOpenRegister: () => void;
}

export function LoginForm({ onSuccess, onOpenRegister }: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginCredentials>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useLogin();

  const submit = handleSubmit((values) => mutate(values, { onSuccess }));

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-8" noValidate>
      <div className="flex flex-col gap-6">
        <Controller
          name="email"
          control={control}
          rules={emailRules}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              type="email"
              label="E-mail"
              placeholder="Введите E-mail"
              autoComplete="email"
              className="h-14 rounded-lg"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={passwordRules}
          render={({ field, fieldState }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              type={showPassword ? "text" : "password"}
              label="Пароль"
              placeholder="Введите пароль"
              autoComplete="current-password"
              className="h-14 rounded-lg"
              error={fieldState.error?.message}
              rightElement={
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-gray flex cursor-pointer transition-colors hover:text-foreground"
                >
                  <Icon
                    name={showPassword ? "ph:eye-slash" : "ph:eye"}
                    size={24}
                  />
                </button>
              }
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-3">
        {error && (
          <p role="alert" className="text-center text-[14px] text-destructive">
            {error.message}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Вход…" : "Войти"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              onOpenRegister();
              navigate(ROUTES.REGISTER);
            }}
            className="flex-1"
          >
            Регистрация
          </Button>
        </div>
      </div>
    </form>
  );
}
