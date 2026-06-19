import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  email: z.string().email("Введите корректный E-mail"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
