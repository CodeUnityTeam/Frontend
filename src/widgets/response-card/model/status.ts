import type { ResponseStatus } from "@/entities/response";

export type StatusConfig = {
  label: string;
  className: string;
};

export const workerResponseStatusMap: Record<ResponseStatus, StatusConfig> = {
  pending: {
    label: "Отклик отправлен",
    className: "text-muted-foreground",
  },
  approved: {
    label: "Отклик принят",
    className: "text-foreground",
  },
  rejected: {
    label: "Отклик отклонен",
    className: "text-foreground",
  },
  withdrawn: {
    label: "Отклик отозван",
    className: "text-foreground",
  },
};

export const workerInviteStatusMap: Record<ResponseStatus, StatusConfig> = {
  pending: {
    label: "Приглашение в проект",
    className: "text-muted-foreground",
  },
  approved: {
    label: "Приглашение принято",
    className: "text-foreground",
  },
  rejected: {
    label: "Приглашение отклонено",
    className: "text-foreground",
  },
  withdrawn: {
    label: "Приглашение отменено",
    className: "text-foreground",
  },
};

export const employerResponseStatusMap: Record<ResponseStatus, StatusConfig> = {
  pending: {
    label: "Новый отклик",
    className: "text-muted-foreground",
  },
  approved: {
    label: "Кандидат принят",
    className: "text-foreground",
  },
  rejected: {
    label: "Кандидат отклонен",
    className: "text-foreground",
  },
  withdrawn: {
    label: "Отклик отозван",
    className: "text-foreground",
  },
};

export const employerInviteStatusMap: Record<ResponseStatus, StatusConfig> = {
  pending: {
    label: "Приглашение отправлено",
    className: "text-muted-foreground",
  },
  approved: {
    label: "Приглашение принято",
    className: "text-foreground",
  },
  rejected: {
    label: "Приглашение отклонено",
    className: "text-foreground",
  },
  withdrawn: {
    label: "Приглашение отозвано",
    className: "text-foreground",
  },
};