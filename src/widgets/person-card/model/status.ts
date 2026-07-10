import type { PersonResponseStatus } from "@/entities/profile";

export const personResponseStatusLabels: Record<PersonResponseStatus, string> =
  {
    pending: "На рассмотрении",
    approved: "Принят",
    rejected: "Отклонён",
    withdrawn: "Отозван",
  };

export const personResponseStatusTextClass: Record<
  PersonResponseStatus,
  string
> = {
  approved: "text-foreground",
  rejected: "text-foreground",
  pending: "text-muted-foreground",
  withdrawn: "text-muted-foreground",
};
