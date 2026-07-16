import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { DurationSlider } from "./duration-slider";
import { FormatFilterSection } from "./format-filter-section";
import { PositionFilterSection } from "./position-filter-section";
import { TagsFilterSection } from "./tags-filter-section";

type FiltersContentProps = {
  className?: string;
};

export function FiltersContent({ className }: FiltersContentProps) {
  const blocks: { id: string; node: ReactNode }[] = [
    { id: "format", node: <FormatFilterSection /> },
    { id: "position", node: <PositionFilterSection /> },
    { id: "duration", node: <DurationSlider /> },
    { id: "tags", node: <TagsFilterSection /> },
  ];

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className={cn(
            "shrink-0 py-6",
            index === 0 && "pt-0",
            index === blocks.length - 1 && "pb-0",
            index < blocks.length - 1 &&
              "border-b border-(--color-light-gray-200)",
          )}
        >
          {block.node}
        </div>
      ))}
    </div>
  );
}
