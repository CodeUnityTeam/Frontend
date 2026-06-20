import { z } from "zod";

export const resetPasswordConfirmSchema = z
  .object({
    password: z
      .string()
      .min(1, "Введите новый пароль")
      .refine((v) => !/\s/.test(v), "Пароль не должен содержать пробелы"),
  })

export type ResetPasswordConfirmValues = z.infer<typeof resetPasswordConfirmSchema>;
