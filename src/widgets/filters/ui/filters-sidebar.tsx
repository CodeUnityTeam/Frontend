import { cn } from "@/shared/lib/utils";

import { FiltersContent } from "./filters-content";

type FiltersSidebarProps = {
  className?: string;
  children?: React.ReactNode
};

export function FiltersSidebar({ className, children }: FiltersSidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-6 flex h-[calc(100dvh-3rem)] w-[413px] shrink-0 flex-col self-start overflow-hidden rounded-lg border border-(--color-light-gray-200) py-6",
        className,
      )}
    >
      {children ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5">
          {children}
        </div>
      ) : (
        <FiltersContent className="px-5" />
      )}
    </aside>
  );
}
