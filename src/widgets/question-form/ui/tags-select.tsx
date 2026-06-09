import { useState } from "react";
import { Icon } from "@iconify/react";

import { getTagLabels, questionTags } from "@/entities/question";
import type { QuestionTag } from "@/entities/question";
import { cn } from "@/shared/lib/utils";

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
  const [open, setOpen] = useState(false);

  const summary = getTagLabels(selectedTags).join(", ") || "Подберите теги";

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
          {questionTags.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => onToggle(tag.value)}
              aria-pressed={isSelected(tag.value)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-base transition-colors",
                isSelected(tag.value)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input text-foreground hover:bg-secondary-hover",
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-(--color-light-gray-200)" />
    </section>
  );
}
