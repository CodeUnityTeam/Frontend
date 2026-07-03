import type { ResponseStatus } from "@/entities/response";

export const statusLabels: Record<ResponseStatus, string> = {
  approved: "Вас приняли",
  pending: "Отклик отправлен",
  rejected: "Вам отказали",
  withdrawn: "Отклик отозван",
};

export const statusBadgeClass: Record<ResponseStatus, string> = {
  approved: "border-primary text-foreground",
  rejected: "border-border text-foreground",
  pending: "border-border text-muted-foreground",
  withdrawn: "border-border text-muted-foreground",
};
