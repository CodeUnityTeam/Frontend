import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

import { filterSections } from "../model/filters-data";
import { DurationSlider } from "./duration-slider";
import { FilterSection } from "./filter-section";

type FiltersContentProps = {
  className?: string;
};

/** Содержимое фильтров: секции с чекбоксами + слайдер «Длительность», разделённые линиями. */
export function FiltersContent({ className }: FiltersContentProps) {
  const [catalog, format, position, tags] = filterSections;

  const blocks: { id: string; node: ReactNode }[] = [
    { id: catalog.id, node: <FilterSection section={catalog} /> },
    { id: format.id, node: <FilterSection section={format} /> },
    { id: position.id, node: <FilterSection section={position} /> },
    { id: "duration", node: <DurationSlider /> },
    { id: tags.id, node: <FilterSection section={tags} /> },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className={cn(
            "py-6",
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
