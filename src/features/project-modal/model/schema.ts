import { z } from "zod";

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(10, "Минимум 10 символов")
      .max(50, "Максимум 50 символов"),
    shortDesc: z
      .string()
      .min(20, "Минимум 20 символов")
      .max(500, "Максимум 500 символов"),
    location: z
      .string()
      .min(1, "Укажите город")
      .max(100, "Максимум 100 символов"),

    startDate: z.string(),
    endDate: z.string().min(1, "Укажите дату окончания"),
    specializations: z
      .array(z.string())
      .min(1, "Добавьте хотя бы одну позицию"),
    skills: z.array(z.string()).min(1, "Добавьте хотя бы один тег"),
    formatId: z.string().min(1, "Выберите формат"),
  })
  .refine((values) => !values.startDate || values.endDate >= values.startDate, {
    message: "Дата окончания не может быть раньше даты начала",
    path: ["endDate"],
  });

export type ProjectFormValues = z.infer<typeof projectSchema>;
