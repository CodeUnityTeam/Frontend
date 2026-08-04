import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateResponseStatus } from "@/entities/response";
import type { ResponseStatus } from "@/entities/response/model/types";
import type { ProjectRole } from "@/entities/project/model/types";

interface ResponseActionsProps {
  responseId: string;
  currentStatus: ResponseStatus;
  userRole: ProjectRole;
  onAction?: () => void;
}

export function ResponseActions({
  responseId,
  currentStatus,
  userRole,
  onAction,
}: ResponseActionsProps) {
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending } = useUpdateResponseStatus();

  if (currentStatus !== "pending") {
    return null;
  }

  // Для employer: "Одобрить", для worker: "Принять приглашение"
  const approveLabel = userRole === "worker" ? "Принять приглашение" : "Одобрить";
 
  const handleApprove = () => {
    updateStatus(
      { responseId, status: "approved" }, 
      {
      onSuccess: () => {
        // Обновляем кеш запроса "people-responses" (чтобы список обновился)
        queryClient.invalidateQueries({ queryKey: ["people-responses"] });
        // Вызываем колбэк (например, refetch для обновления списка)
        onAction?.();
      },
    });
  };

  const handleReject = () => {
    updateStatus(
      { responseId, status: "rejected" }, 
      {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["people-responses"] });
        onAction?.();
      },
    });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Button
        type="button"
        disabled={isPending}
        onClick={handleApprove}
        className="h-12 flex-1 rounded-[14px] bg-primary text-white text-[16px] font-semibold"
      >
        <Icon name="ph:check" className="mr-2 text-[20px]" />
        {isPending ? "..." : approveLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleReject}
        className="size-12 rounded-full border-primary p-0"
      >
        <Icon name="ph:x" className="text-[22px]" />
      </Button>
    </div>
  );
}