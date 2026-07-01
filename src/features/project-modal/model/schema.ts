import { z } from "zod";

const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;

export const projectSchema = z.object({
  title: z
    .string()
    .min(10, "Минимум 10 символов")
    .max(50, "Максимум 50 символов"),
  shortDesc: z
    .string()
    .min(20, "Минимум 20 символов")
    .max(500, "Максимум 500 символов"),
  location: z.string().optional(),
  startDate: z.string().regex(dateRegex, "Формат: дд.мм.гггг"),
  endDate: z.string().regex(dateRegex, "Формат: дд.мм.гггг"),
  specializations: z.array(z.string()),
  skills: z.array(z.string()),
  formatId: z.string().min(1, "Выберите формат"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
