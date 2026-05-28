import { Icon } from "@iconify/react";
import { useState, useCallback } from "react";
import { Button } from "@/shared/ui/button";

type IChatBotCard = {
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
}: IChatBotCard) {
  const [isLike, setIsLike] = useState(false);

  const handleLike = useCallback(() => {
    setIsLike((prev) => !prev);
  }, []);

  const handleApply = useCallback(() => {
    console.log("Откликнуться");
  }, []);

  return (
    <div className="w-full max-w-[273px] rounded-[var(--radius-lg)] border-1 border-[#9A9BA9] p-4">
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

      <div className="mt-3">
        <h2 className="leading-1.3 text-[18px] font-semibold">{title}</h2>

        <p className="leading-1.4 mt-1 text-[14px] font-normal">
          {description}
        </p>

        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-2xl bg-[#D3E9F7] px-3 py-1 text-[13px] font-normal"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col flex-row gap-6">
          <div className="flex items-center justify-center gap-1">
            <Icon
              icon="ph:calendar-dots"
              className="gap-1 text-xl text-[#9A9BA9]"
            />
            <span className="font-raleway text-[14px]">{date}</span>
          </div>

          <div className="leading-1.4 flex items-center gap-1 text-[14px] font-normal">
            <Icon icon="ph:map-pin" className="text-xl text-[#9A9BA9]" />
            <span>{location}</span>
          </div>
        </div>

        <Button
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border-1 border-[#002BFF] py-2 text-[16px] font-semibold text-[#252728]"
          onClick={handleApply}
          variant="ghost"
        >
          <Icon icon="ph:chats-teardrop-light" className="text-xl" />
          <span>Откликнуться</span>
        </Button>
      </div>
    </div>
  );
}
