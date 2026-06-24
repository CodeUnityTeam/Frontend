import { z } from "zod";

export const resetPasswordConfirmSchema = z.object({
  new_password: z
    .string()
    .min(1, "Введите новый пароль")
    .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
  new_password_confirm: z
    .string()
    .min(1, "Введите новый пароль")
    .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы")
}).refine((data) => data.new_password === data.new_password_confirm, {
    message: "Пароли должны совпадать",
    path: ["new_password_confirm"],
});

export type ResetPasswordConfirmValues = z.infer<typeof resetPasswordConfirmSchema>;
