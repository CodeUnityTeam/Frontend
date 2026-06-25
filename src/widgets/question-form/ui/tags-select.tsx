import { useState } from "react";
import { Icon } from "@iconify/react";

import type { QuestionTag } from "@/entities/question";
import { cn } from "@/shared/lib/utils";
import { useSkills } from "@/entities/question/api/use-skills";

type TagsSelectProps = {
  selectedTags: QuestionTag[];
  onToggle: (value: QuestionTag) => void;
  isSelected: (value: QuestionTag) => boolean;
};

export function TagsSelect({
  selectedTags,
  onToggle,
  isSelected,
}: TagsSelectProps) {
  const { data: skills, isPending } = useSkills();
  const [open, setOpen] = useState(false);

  const summary =
    selectedTags
      .map((id) => skills?.find((s) => s.skillId === id)?.name)
      .filter(Boolean)
      .join(", ") || "Подберите теги";

  return (
    <section className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex cursor-pointer items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[20px] font-semibold text-foreground">
          {summary}
        </span>
        <Icon
          icon="ph:caret-down"
          className={cn(
            "size-6 shrink-0 text-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="flex flex-wrap gap-2">
          {isPending && (
            <p className="animate-pulse p-4">Загрузка списка тегов...</p>
          )}
          {skills?.map((tag) => (
            <button
              key={tag.skillId}
              type="button"
              onClick={() => onToggle(tag.skillId)}
              aria-pressed={isSelected(tag.skillId)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-base transition-colors",
                isSelected(tag.skillId)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input text-foreground hover:bg-secondary-hover",
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-(--color-light-gray-200)" />
    </section>
  );
}
