import { Icon } from "@iconify/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";
import { sortOptions } from "../model/filters-data";

type SortSelectProps = {
  className?: string;
};

/** Выпадающий список «Сортировать по». */
export function SortSelect({ className }: SortSelectProps) {
  const { sort, setSort } = useFilters();
  const current = sortOptions.find((option) => option.value === sort) ?? sortOptions[0];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-[18px] leading-normal whitespace-nowrap text-foreground">
        Сортировать по
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex w-[200px] cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-[18px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-primary">
          <span>{current.label}</span>
          <Icon
            icon="lucide:chevron-down"
            className="size-6 shrink-0 transition-transform group-data-[state=open]:rotate-180"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-(--radix-dropdown-menu-trigger-width)"
        >
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSort(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
