import { Icon } from "@iconify/react";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";
import { useLikeProject } from "@/entities/project";
import { useWithdrawResponse } from "@/entities/response/api/use-withdraw-response";
import { useUpdateResponseStatus } from "@/entities/response/api/use-update-response-status";
import {
  type ProjectResponse
} from "@/entities/response";
import { getResponseCardState } from "../model/response-card";
import type { ProjectsRelation } from "@/entities/profile";

type ResponseCardProps = {
  response: ProjectResponse;
  role: ProjectsRelation;
};

const contactButtonClass =
  "flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold hover:bg-primary/5";

export function ResponseCard({
  response,
  role,
}: ResponseCardProps) {

  const { status, actions } = getResponseCardState(
    response,
    role,
  );

  const { mutate: toggleLike } = useLikeProject();

  const {
    mutate: withdraw,
    isPending: isWithdrawPending
  } = useWithdrawResponse();

  const {
    mutate: updateStatus,
    isPending: isStatusUpdating
  } = useUpdateResponseStatus();

  const {
  projectId,
  isLikedByMe,
  responseId,
  title,
  shortDesc,
  skills,
  createdAt,
  location,
} = response;

  const handleLike = () => {
    toggleLike({
      projectId, liked: !isLikedByMe
    });
  };

  const handleWithdraw = () => {
    if (!window.confirm(actions.confirmText)) {
      return;
    }

    withdraw({
      responseId,
    });
  };

  const handleStatusChange = (
    status: "approved" | "rejected"
  ) => {
    updateStatus({
      responseId,
      status,
    });
  };

  const formattedDate = formatDate(createdAt);
    
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-2xl border bg-background px-3 py-1 text-[13px] font-semibold",
            status.className,
          )}
        >
          {status.label}
        </span>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={isLikedByMe ? "Убрать лайк" : "Поставить лайк"}
          aria-pressed={isLikedByMe}
          onClick={handleLike}
        >
          <Icon
            icon={isLikedByMe ? "ph:heart-straight-fill" : "ph:heart-straight"}
            className={cn("text-xl", isLikedByMe && "text-primary")}
          />
        </Button>
      </div>

      <h2 className="leading-1.3 text-[18px] font-semibold">
        {title}
      </h2>

      <p className="leading-1.4 mt-1 text-[14px] font-normal">
        {shortDesc}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {skills.map((skill) => (
          <Tag
            key={skill.skillId}
            label={skill.name}
            className="rounded-2xl bg-(--secondary-button) text-[13px] font-normal"
          />
        ))}
      </div>

      <div className="mt-4 flex grow flex-col justify-end gap-4">
        <div className="flex flex-row items-center gap-3">
          {formattedDate && (
            <div className="flex shrink-0 items-center gap-1">
              <Icon
                icon="ph:calendar-dots"
                className="shrink-0 text-xl text-muted-foreground"
              />
              <span className="font-raleway text-[14px] whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
          )}

          {location && (
            <div className="leading-1.4 flex min-w-0 items-center gap-1 text-[14px] font-normal">
              <Icon
                icon="ph:map-pin"
                className="shrink-0 text-xl text-muted-foreground"
              />
              <span className="min-w-0 truncate">{location}</span>
            </div>
          )}
        </div>

        {/* Одобрить/отклонить отклик/приглашение */}
        {actions.canApprove && (
          <div className="flex gap-2">
            <Button
              className="w-full rounded-xl"
              disabled={isStatusUpdating}
              onClick={() => handleStatusChange("approved")}
            >
              Одобрить
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl"
              disabled={isStatusUpdating}
              onClick={() => handleStatusChange("rejected")}
            >
              Отклонить
            </Button>
          </div>
        )}

        {/* отозвать свой(е) отклик/приглашение */}
        {actions.canWithdraw && (
          <Button
            variant="outline"
            disabled={isWithdrawPending}
            className="w-full rounded-xl"
            onClick={handleWithdraw}
          >
            {actions.withdrawLabel}
          </Button>
        )}

        {/* связаться */}
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
      </div>
    </div>
  );
}