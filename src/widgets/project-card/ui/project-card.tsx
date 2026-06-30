import { Icon } from "@iconify/react";
import { useCallback } from "react";

import { useLikeProject } from "@/entities/project";
import { useIsAuthed } from "@/shared/lib/auth";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";

type ProjectCardProps = {
  projectId: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  location: string;
  isLikedByMe: boolean;
};

export function ProjectCard({
  projectId,
  title,
  description,
  tags,
  date,
  location,
  isLikedByMe,
}: ProjectCardProps) {
  const isAuthed = useIsAuthed();
  const { mutate: toggleLike } = useLikeProject();

  const handleLike = useCallback(() => {
    toggleLike({ projectId, liked: !isLikedByMe });
  }, [toggleLike, projectId, isLikedByMe]);

  const handleApply = useCallback(() => {
    console.log("Откликнуться");
  }, []);

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border p-4">
      {isAuthed && (
        <div className="mb-3 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              isLikedByMe ? "Убрать из избранного" : "Добавить в избранное"
            }
            type="button"
            onClick={handleLike}
            aria-pressed={isLikedByMe}
          >
            <Icon
              icon={isLikedByMe ? "ph:heart-straight-fill" : "ph:heart-straight"}
              className={cn("text-xl", isLikedByMe && "text-primary")}
            />
          </Button>
        </div>
      )}

      <h2 className="leading-1.3 text-[18px] font-semibold">{title}</h2>

      <p className="leading-1.4 mt-1 text-[14px] font-normal">{description}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
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

          <div className="leading-1.4 flex min-w-0 items-center gap-1 text-[14px] font-normal">
            <Icon
              icon="ph:map-pin"
              className="shrink-0 text-xl text-muted-foreground"
            />
            <span className="min-w-0 truncate">{location}</span>
          </div>
        </div>

        {isAuthed && (
          <Button
            className="flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold text-foreground"
            onClick={handleApply}
            variant="ghost"
          >
            <Icon icon="ph:chats-teardrop-light" className="text-xl" />
            <span>Откликнуться</span>
          </Button>
        )}
      </div>
    </div>
  );
}
