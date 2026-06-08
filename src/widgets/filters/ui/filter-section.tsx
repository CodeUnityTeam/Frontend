import { useState } from "react";
import { Icon } from "@iconify/react";

import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";
import type { FilterSection as FilterSectionType } from "../model/types";

type FilterSectionProps = {
  section: FilterSectionType;
};

export function FilterSection({ section }: FilterSectionProps) {
  const { isChecked, toggle } = useFilters();
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between py-1 text-left"
      >
        <span className="text-xl leading-[1.3] font-semibold text-foreground">
          {section.title}
        </span>
        <Icon
          icon="lucide:chevron-up"
          className={cn(
            "size-6 shrink-0 text-foreground transition-transform",
            !open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul className="flex flex-col">
          {section.options.map((option) => (
            <li key={option.value} className="py-1">
              <label className="flex h-7 cursor-pointer items-center gap-2">
                <Checkbox
                  checked={isChecked(section.id, option.value)}
                  onCheckedChange={() => toggle(section.id, option.value)}
                />
                <span className="text-[18px] leading-normal text-foreground">
                  {option.label}
                  {option.count !== undefined && ` (${option.count})`}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
