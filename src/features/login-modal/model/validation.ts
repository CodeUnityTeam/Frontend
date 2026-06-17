import type { RegisterOptions } from "react-hook-form";

import type { LoginCredentials } from "@/entities/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailRules: RegisterOptions<LoginCredentials, "email"> = {
  required: "Введите E-mail",
  pattern: {
    value: EMAIL_PATTERN,
    message: "Введите корректный E-mail",
  },
};

export const passwordRules: RegisterOptions<LoginCredentials, "password"> = {
  required: "Введите пароль",
  minLength: {
    value: 8,
    message: "Пароль должен быть не менее 8 символов",
  },
};
