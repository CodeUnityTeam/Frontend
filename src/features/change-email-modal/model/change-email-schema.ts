import { z } from "zod";

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, "Введите email")
    .email("Введите корректный email адрес"),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;
