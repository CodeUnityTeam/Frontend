import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useRole } from "@/entities/profile";

import { useLikeProject } from "@/entities/project";
import { RESPONSES_QUERY_KEY, type ProjectResponse } from "@/entities/response";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";
import {
  statusLabels,
  statusBadgeClass,
} from "@/widgets/response-card/model/status";

const dateFormatter = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(iso: string | null): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

const contactButtonClass =
  "flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold text-foreground";

type ResponseCardProps = {
  response: ProjectResponse;
};

export function ResponseCard({ response }: ResponseCardProps) {
  const { role } = useRole();
  const isEmployer = role === "employer";

  const queryClient = useQueryClient();
  const { mutate: toggleLike } = useLikeProject();

  const { projectId, isLikedByMe } = response;

  const handleLike = useCallback(() => {
    toggleLike(
      { projectId, liked: !isLikedByMe },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: [RESPONSES_QUERY_KEY] }),
      },
    );
  }, [toggleLike, queryClient, projectId, isLikedByMe]);

  const date = formatDate(response.createdAt);
  const canContact =
    response.status === "approved" && Boolean(response.authorEmail);

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-2xl border bg-background px-3 py-1 text-[13px] font-semibold",
            statusBadgeClass[response.status],
          )}
        >
          {statusLabels[response.status]}
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
        {response.title}
      </h2>

      <p className="leading-1.4 mt-1 text-[14px] font-normal">
        {response.shortDesc}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {response.skills.map((skill) => (
          <Tag
            key={skill.skillId || skill.name}
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

        {isEmployer && (canContact ? (
          <Button variant="ghost" className={contactButtonClass} asChild>
            <a href={`mailto:${response.authorEmail}`}>
              <Icon icon="ph:chats-teardrop-light" className="text-xl" />
              <span>Связаться</span>
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            type="button"
            disabled
            className={cn(
              contactButtonClass,
              "disabled:border-(--color-light-gray-200) disabled:bg-muted disabled:text-muted-foreground",
            )}
          >
            <Icon icon="ph:chats-teardrop-light" className="text-xl" />
            <span>Связаться</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
