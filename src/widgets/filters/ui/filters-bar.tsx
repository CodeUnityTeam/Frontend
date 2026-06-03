import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";
import { SortSelect } from "./sort-select";

type FiltersBarProps = {
  className?: string;
};

/** Верхний бар (desktop): заголовок «Фильтры», сброс и сортировка. */
export function FiltersBar({ className }: FiltersBarProps) {
  const { reset } = useFilters();

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex w-[413px] items-center justify-between">
        <h2 className="text-[26px] leading-8 font-bold text-foreground">Фильтры</h2>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer py-3 text-base font-semibold text-foreground transition-colors hover:text-primary"
        >
          Сбросить
        </button>
      </div>
      <SortSelect />
    </div>
  );
}
