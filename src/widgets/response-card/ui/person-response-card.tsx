import { Icon } from "@iconify/react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { PersonCard } from "@/widgets/person-card";
import {
  useUpdateResponseStatus,
  useWithdrawResponse,
} from "@/entities/response";
import type { PersonResponse } from "@/entities/profile";
import { getResponseCardState } from "../model/response-card";

type PersonResponseCardProps = {
  response: PersonResponse;
};

const contactButtonClass =
  "flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-2 text-[16px] font-semibold hover:bg-primary/5";

export function PersonResponseCard({
  response,
}: PersonResponseCardProps) {

  const { status, actions } = getResponseCardState(
    response,
    "employer",
  );

  const {
    mutate: withdraw,
    isPending: isWithdrawPending,
  } = useWithdrawResponse();

  const {
    mutate: updateStatus,
    isPending: isStatusUpdating,
  } = useUpdateResponseStatus();

  const handleWithdraw = () => {
    if (!window.confirm(actions.confirmText)) {
      return;
    }

    withdraw({
      responseId: response.responseId,
    });
  };

  const handleStatusChange = (
    status: "approved" | "rejected",
  ) => {
    updateStatus({
      responseId: response.responseId,
      status,
    });
  };

  return (
    <PersonCard
      person={response.person}
      badge={
        <span
          className={cn(
            "rounded-2xl border bg-background px-3 py-1 text-[13px] font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>
      }
      subtitle={
        <p className="text-[14px] text-muted-foreground">
          {response.initiatorType === "author"
            ? `Приглашение в проект «${response.projectTitle}»`
            : `Отклик на проект «${response.projectTitle}»`}
        </p>
      }
      footer={
        <>
          {actions.canApprove && (
            <div className="flex gap-2">
              <Button
                className="w-full rounded-xl"
                disabled={isStatusUpdating}
                onClick={() =>
                  handleStatusChange("approved")
                }
              >
                Одобрить
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-xl"
                disabled={isStatusUpdating}
                onClick={() =>
                  handleStatusChange("rejected")
                }
              >
                Отклонить
              </Button>
            </div>
          )}

          {actions.canWithdraw && (
            <Button
              variant="outline"
              className="w-full rounded-xl"
              disabled={isWithdrawPending}
              onClick={handleWithdraw}
            >
              {actions.withdrawLabel}
            </Button>
          )}

          {actions.canContact && (
            <Button
              variant="outline"
              className={contactButtonClass}
            >
              <Icon
                icon="ph:chat-circle-dots"
                className="text-lg"
              />
              Связаться
            </Button>
          )}
        </>
      }
    />
  );
}