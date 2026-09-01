import { z } from "zod";

const FIELD_ERROR_TEXT = "Недопустимое значение поля";

const NAME_REGEXP = /^[A-Za-zА-Яа-яЁё]+$/;
const PASSWORD_REGEXP = /^[A-Za-z0-9]+$/;

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "Введите имя")
    .max(35, FIELD_ERROR_TEXT)
    .refine((val) => NAME_REGEXP.test(val), FIELD_ERROR_TEXT),
  lastName: z
    .string()
    .min(1, "Введите фамилию")
    .max(65, FIELD_ERROR_TEXT)
    .refine((val) => NAME_REGEXP.test(val), FIELD_ERROR_TEXT),
  email: z.string().email("Введите корректный E-mail"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(128, FIELD_ERROR_TEXT)
    .refine((val) => PASSWORD_REGEXP.test(val), FIELD_ERROR_TEXT),
  consent: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие на обработку данных",
  }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
