import { Icon } from "@iconify/react";
import { useState, useCallback } from "react";

import { Button } from "@/shared/ui/button";
import { useIsAuthed } from "@/shared/lib/auth";

type TChatBotCard = {
  title: string;
  description: string;
  tags: string[];
  date: string;
  location: string;
  onFavorite?: () => void;
  onApply?: () => void;
};

export function ChatBotCard({
  title,
  description,
  tags,
  date,
  location,
}: TChatBotCard) {
  const isAuthorized = useIsAuthed();
  const [isLike, setIsLike] = useState(false);

  const handleLike = useCallback(() => {
    setIsLike((prev) => !prev);
  }, []);

  const handleApply = useCallback(() => {
    console.log("Откликнуться");
  }, []);

  return (
    <div className="h-[370px] w-full max-w-[273px] rounded-[var(--radius-lg)] border border-[var(--color-gray)] p-4">
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

      <div className="mt-3 flex flex-1 flex-col">
        <h2 className="text-[18px] leading-[1.3] font-semibold">{title}</h2>

        <p className="mt-1 text-[14px] leading-[1.4] font-normal">
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

        <div className="mt-4 flex flex-row gap-6">
          <div className="flex items-center justify-center gap-1">
            <Icon
              icon="ph:calendar-dots"
              className="text-xl text-[var(--color-gray)]"
            />
            <span className="font-raleway text-[14px]">{date}</span>
          </div>

          <div className="flex items-center gap-1 text-[14px] leading-[1.4] font-normal">
            <Icon
              icon="ph:map-pin"
              className="text-xl text-[var(--color-gray)]"
            />
            <span>{location}</span>
          </div>
        </div>

        {isAuthorized && (
          <Button
            className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-[#002BFF] py-2 text-[16px] font-semibold text-[#252728]"
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
