import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Введите текущий пароль")
    .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
  newPassword: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Новый пароль не должен совпадать с текущим",
  path: ["newPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
