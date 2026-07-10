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
        "w-[413px] shrink-0 rounded-lg border border-(--color-light-gray-200) py-6",
        className,
      )}
    >
      {children ? <div className="px-5">{children}</div> : <FiltersContent className="px-5" />}
    </aside>
  );
}
