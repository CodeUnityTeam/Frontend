import type { ResponseStatus } from "@/entities/response";

export const statusLabels: Record<ResponseStatus, string> = {
  pending: "Ожидает",
  approved: "Одобрено",
  rejected: "Отклонено",
  withdrawn: "Отозвано",
};

export const statusBadgeClass: Record<ResponseStatus, string> = {
  pending: "text-yellow-600 border-yellow-400 bg-yellow-50",
  approved: "text-green-600 border-green-400 bg-green-50",
  rejected: "text-red-600 border-red-400 bg-red-50",
  withdrawn: "text-gray-500 border-gray-300 bg-gray-50",
};
