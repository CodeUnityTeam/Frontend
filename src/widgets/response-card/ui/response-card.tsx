import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useRole } from "@/entities/profile";

import { useLikeProject } from "@/entities/project";
import { RESPONSES_QUERY_KEY, type ProjectResponse } from "@/entities/response";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";
import {
  statusLabels,
  statusBadgeClass,
} from "@/widgets/response-card/model/status";
import { useWithdrawResponse } from "@/entities/response/api/use-withdraw-response";

type ResponseCardProps = {
  response: ProjectResponse;
};

// Статусы для Worker
const workerStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Отклик отправлен", className: "text-muted-foreground" },
  approved: { label: "Отклик принят", className: "text-foreground" },
  rejected: { label: "Отклик отказан", className: "text-foreground" },
  withdrawn: { label: "Отклик отозван", className: "text-foreground" },
};

// Статусы для Employer
const contactButtonClass =
  "flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold text-foreground";


export function ResponseCard({ response }: ResponseCardProps) {
  const { role } = useRole();
  const isEmployer = role === "employer";
  const isWorker = role === "worker";

  const queryClient = useQueryClient();
  const { mutate: toggleLike } = useLikeProject();
  const { mutate: withdraw, isPending: isWithdrawPending } = useWithdrawResponse();
  const [isWithdrawn, setIsWithdrawn] = useState(false);

  const { projectId, isLikedByMe, responseId, status } = response;

  const handleLike = useCallback(() => {
    toggleLike(
      { projectId, liked: !isLikedByMe },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [RESPONSES_QUERY_KEY] }),
      },
    );
  }, [toggleLike, queryClient, projectId, isLikedByMe]);

  const handleWithdraw = useCallback(() => {
    if (window.confirm("Вы уверены, что хотите отозвать свой отклик?")) {
      withdraw(
        { responseId },
        {
          onSuccess: () => {
            setIsWithdrawn(true);
            queryClient.invalidateQueries({ queryKey: [RESPONSES_QUERY_KEY] });
          },
        }
      );
    }
  }, [withdraw, responseId, queryClient]);

  const date = formatDate(response.createdAt);

  // Отклик уже отозван (через API или локально)
  const isResponseWithdrawn = status === "withdrawn" || isWithdrawn;

  // Для Worker: кнопка активна только если статус "approved" и не отозван
  const isContactActive = isWorker && response.status === "approved" && !isResponseWithdrawn;

  // Для Worker: показываем кнопку "Отозвать" только если статус "pending" и не отозван
  const showWithdrawButton = isWorker && status === "pending" && !isResponseWithdrawn;

  const contactButtonStyles = isContactActive
    ? "border-primary text-foreground hover:bg-primary/5"
    : "border-(--color-light-gray-200) bg-muted text-muted-foreground cursor-not-allowed";
    
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {isWorker && response.status ? (
          <span
            className={cn(
              "rounded-2xl border bg-background px-3 py-1 text-[13px] font-semibold",
              workerStatusMap[response.status]?.className || ""
            )}
          >
            {workerStatusMap[response.status]?.label || response.status}
          </span>
        ) : (
          <span
            className={cn(
              "rounded-2xl border bg-background px-3 py-1 text-[13px] font-semibold",
              statusBadgeClass[response.status],
            )}
          >
            {statusLabels[response.status]}
          </span>
        )}

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
        {response.title}
      </h2>

      <p className="leading-1.4 mt-1 text-[14px] font-normal">
        {response.shortDesc}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {response.skills.map((skill) => (
          <Tag
            key={skill.skillId}
            label={skill.name}
            className="rounded-2xl bg-(--secondary-button) text-[13px] font-normal"
          />
        ))}
      </div>

      <div className="mt-4 flex grow flex-col justify-end gap-4">
        <div className="flex flex-row items-center gap-3">
          {date && (
            <div className="flex shrink-0 items-center gap-1">
              <Icon
                icon="ph:calendar-dots"
                className="shrink-0 text-xl text-muted-foreground"
              />
              <span className="font-raleway text-[14px] whitespace-nowrap">
                {date}
              </span>
            </div>
          )}

          {response.location && (
            <div className="leading-1.4 flex min-w-0 items-center gap-1 text-[14px] font-normal">
              <Icon
                icon="ph:map-pin"
                className="shrink-0 text-xl text-muted-foreground"
              />
              <span className="min-w-0 truncate">{response.location}</span>
            </div>
          )}
        </div>

        {/* Блок кнопок для Worker */}
        {isWorker && (
          <div className="flex gap-2">
            {/* Кнопка "Связаться" */}
            <Button
              variant="ghost"
              type="button"
              disabled={!isContactActive}
              className={cn(contactButtonClass, contactButtonStyles)}
              onClick={() => {
                if (isContactActive && response.authorEmail) {
                  window.location.href = `mailto:${response.authorEmail}`;
                }
              }}
            >
              <Icon icon="ph:chats-teardrop-light" className="text-xl" />
              <span>Связаться</span>
            </Button>

            {/* Кнопка "Отозвать отклик" */}
            {showWithdrawButton && (
              <Button
                variant="outline"
                type="button"
                disabled={isWithdrawPending}
                className="flex w-full items-center justify-center gap-1 rounded-xl border-(--color-light-gray-200) py-2 text-[16px] font-semibold text-destructive hover:bg-destructive/10"
                onClick={handleWithdraw}
              >
                <Icon 
                  icon={isWithdrawPending ? "ph:spinner" : "ph:x"} 
                  className={cn("text-xl", isWithdrawPending && "animate-spin")}
                />
                <span>{isWithdrawPending ? "Отзыв..." : "Отозвать"}</span>
              </Button>
            )}

            {/* Если отклик уже отозван - показываем статус */}
            {isResponseWithdrawn && (
              <div className="flex w-full items-center justify-center gap-1 rounded-xl border border-muted bg-muted/50 py-2 text-[16px] font-medium text-muted-foreground">
                <Icon icon="ph:check-circle" className="text-xl" />
                <span>Отклик отозван</span>
              </div>
            )}
          </div>
        )}

        {/* Для Employer: кнопка "Связаться" - активна только если approved */}
        {isEmployer && response.status === "approved" && Boolean(response.authorEmail) && (
          <Button
            variant="ghost"
            className={cn(contactButtonClass, "border-primary text-foreground hover:bg-primary/5")}
            asChild
          >
            <a href={`mailto:${response.authorEmail}`}>
              <Icon icon="ph:chats-teardrop-light" className="text-xl" />
              <span>Связаться</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}