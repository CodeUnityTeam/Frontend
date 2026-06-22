import { Icon } from "@iconify/react";
import { useState, useCallback } from "react";

import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";

type TChatBotCard = {
  title: string;
  description: string;
  tags: string[];
  date: string;
  location: string;
};

export function ChatBotCard({
  title,
  description,
  tags,
  date,
  location,
}: TChatBotCard) {
  const isAuthed = useIsAuthed();
  const [isLike, setIsLike] = useState(false);

  const handleLike = useCallback(() => {
    setIsLike((prev) => !prev);
  }, []);

  const handleApply = useCallback(() => {
    console.log("Откликнуться");
  }, []);

  return (
    <div className="flex h-full w-[273px] flex-col rounded-lg border border-border bg-card p-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Добавить в избранное"
          type="button"
          onClick={handleLike}
          aria-pressed={isLike}
        >
          <Icon icon="ph:heart-straight" className="text-xl" />
        </Button>
      </div>

      <h2 className="leading-1.3 mt-3 text-[18px] font-semibold">{title}</h2>

      <p className="leading-1.4 mt-1 line-clamp-3 text-[14px] font-normal">
        {description}
      </p>

      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-2xl px-3 py-1 text-[13px] font-normal"
            style={{ backgroundColor: "var(--secondary-button)" }}
          >
            {tag}
          </span>
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
