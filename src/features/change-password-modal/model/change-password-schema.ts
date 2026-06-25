import { z } from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(1, "Введите текущий пароль")
      .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
    new_password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: "Новый пароль не должен совпадать с текущим",
    path: ["new_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
