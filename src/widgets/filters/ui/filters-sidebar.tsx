import { cn } from "@/shared/lib/utils";

import { FiltersContent } from "./filters-content";

type FiltersSidebarProps = {
  className?: string;
};

/** Боковая панель фильтров (desktop). */
export function FiltersSidebar({ className }: FiltersSidebarProps) {
  return (
    <aside
      className={cn(
        "w-[413px] shrink-0 rounded-lg border border-(--color-light-gray-200) py-6",
        className,
      )}
    >
      <FiltersContent className="px-5" />
    </aside>
  );
}
