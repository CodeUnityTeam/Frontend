import { Icon } from "@iconify/react";
import { useCallback } from "react";

import {
  useLikePerson,
  useRole,
  type Person,
  type PersonResponseStatus,
} from "@/entities/profile";
import { useInviteUser } from "@/entities/project";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";
import { ResponseActions } from "@/features/response-actions";

type PersonCardProps = {
  person: Person;
  projectId?: string;
  badge?: string;
  badgeClassName?: string;
  note?: string;
  responseId?: string;
  responseStatus?: PersonResponseStatus;
  onAction?: () => void;
};

// Статусы для Employer (внизу карточки)
const employerStatusMap: Record<string, { label: string; icon: string }> = {
  approved: { label: "Отклик одобрен", icon: "ph:check-circle" },
  rejected: { label: "Отклик отклонен", icon: "ph:x-circle" },
  withdrawn: { label: "Отклик отозван", icon: "ph:arrow-counter-clockwise" },
};

export function PersonCard({
  person,
  projectId,
  badge,
  badgeClassName,
  note,
  responseId,
  responseStatus,
  onAction,
}: PersonCardProps) {
  const { role } = useRole();
  const isEmployer = role === "employer";
  const { mutate: toggleLike } = useLikePerson();
  const { mutate: invite, isPending: isInviting } = useInviteUser();

  const { userId, isLiked } = person;

  const handleLike = useCallback(() => {
    toggleLike({ userId, liked: !isLiked });
  }, [toggleLike, userId, isLiked]);

  const fullName = `${person.firstName} ${person.lastName}`.trim();
  const initials = `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`;
  const specializations = person.specializations
    .map((spec) => spec.name)
    .join(", ");

  // Для employer: показываем статус внизу если не pending
  const showStatusInFooter =
    isEmployer && responseStatus && responseStatus !== "pending";
  // Для employer: показываем кнопки только если pending
  const showActions =
    isEmployer && responseStatus === "pending" && responseId && role;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {/* Скрываем badge для employer */}
        {!isEmployer && badge ? (
          <span
            className={cn(
              "rounded-2xl border border-border bg-background px-3 py-1 text-[13px] font-semibold",
              badgeClassName,
            )}
          >
            {badge}
          </span>
        ) : (
          <span />
        )}

        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={isLiked}
          onClick={handleLike}
        >
          <Icon
            icon={isLiked ? "ph:heart-straight-fill" : "ph:heart-straight"}
            className={cn("text-xl", isLiked && "text-primary")}
          />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={person.avatarUrl || undefined} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="leading-1.3 truncate text-[18px] font-semibold">
            {fullName}
          </h2>
          {specializations && (
            <p className="leading-1.4 truncate text-[14px] text-muted-foreground">
              {specializations}
            </p>
          )}
        </div>
      </div>

      {note && (
        <p className="leading-1.4 mt-2 text-[14px] text-muted-foreground">
          {note}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {person.skills.map((skill) => (
          <Tag
            key={skill.skillId}
            label={skill.name}
            className="rounded-2xl bg-(--secondary-button) text-[13px] font-normal"
          />
        ))}
      </div>

      <div className="mt-4 flex grow flex-col justify-end gap-4">
        {person.city && (
          <div className="leading-1.4 flex min-w-0 items-center gap-1 text-[14px] font-normal">
            <Icon
              icon="ph:map-pin"
              className="shrink-0 text-xl text-muted-foreground"
            />
            <span className="min-w-0 truncate">{person.city}</span>
          </div>
        )}

        {/* Для employer: 
            - если pending → показываем кнопки "Одобрить/Отклонить"
            - если approved/rejected/withdrawn → показываем неактивную кнопку со статусом
        */}
        {isEmployer && (
          <>
            {showActions && (
              <div className="flex justify-end">
                <ResponseActions
                  responseId={responseId!}
                  currentStatus={responseStatus!}
                  userRole={role}
                  onAction={onAction}
                />
              </div>
            )}

            {showStatusInFooter && (
              <Button
                variant="ghost"
                type="button"
                disabled
                className={cn(
                  "flex h-12 w-full items-center justify-center gap-2 rounded-xl border py-2 text-[16px] font-semibold",
                  "cursor-not-allowed border-[#9A9BA9] text-[#9A9BA9]",
                )}
              >
                <Icon
                  icon={employerStatusMap[responseStatus!]?.icon || "ph:info"}
                  className="text-xl"
                />
                <span>
                  {employerStatusMap[responseStatus!]?.label || responseStatus}
                </span>
              </Button>
            )}
          </>
        )}

        {/* Для worker: кнопка "Связаться" */}
        {!isEmployer && (
          <Button
            variant="ghost"
            type="button"
            title="Бэк пока не отдаёт контакты соискателя"
            disabled={!projectId || isInviting}
            className="flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold text-foreground disabled:border-(--color-light-gray-200) disabled:bg-muted disabled:text-muted-foreground"
            onClick={() => projectId && invite({ projectId, userId })}
          >
            <Icon icon="ph:chats-teardrop-light" className="text-xl" />
            <span>Связаться</span>
          </Button>
        )}
      </div>
    </div>
  );
}
