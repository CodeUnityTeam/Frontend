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

type SortMobileProps = {
  className?: string;
};

export function SortMobile({ className }: SortMobileProps) {
  const { sort, setSort } = useFilters();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 text-base font-semibold text-foreground outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Icon icon="ph:arrows-down-up" className="size-6" />
        Сортировка
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSort(option.value)}
            className={cn(
              "cursor-pointer",
              option.value === sort && "text-primary",
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
