import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().min(1, "Введите имя"),
  lastName: z.string().min(1, "Введите фамилию"),
  email: z.string().email("Введите корректный E-mail"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие на обработку данных",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
