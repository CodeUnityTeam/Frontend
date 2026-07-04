import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/shared/ui/sheet";
import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";
import { FiltersContent } from "./filters-content";

type FiltersMobileProps = {
  className?: string;
  children?: React.ReactNode
};

export function FiltersMobile({ className, children }: FiltersMobileProps) {
  const { reset, selectedCount } = useFilters();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 text-base font-semibold text-foreground outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Icon icon="ph:funnel" className="size-6" />
          Фильтры
          {selectedCount > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-sm font-semibold text-primary-foreground">
              {selectedCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-dvh gap-0 p-0"
        aria-describedby={undefined}
      >
        <header className="flex items-center justify-between border-b border-(--color-light-gray-200) px-4 py-3">
          <button
            type="button"
            onClick={reset}
            className="text-base font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Сбросить
          </button>
          <SheetTitle className="text-xl font-bold text-foreground">
            Фильтры
          </SheetTitle>
          <SheetClose className="text-base font-medium text-primary transition-colors hover:text-primary-hover">
            Готово
          </SheetClose>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children ? (
            <div className="px-4 pt-4">{children}</div>
          ) : (
            <FiltersContent className="px-4 [&>*:first-child]:pt-4" />
          )}
        </div>

        <footer className="border-t border-(--color-light-gray-200) p-4">
          <SheetClose asChild>
            <Button size="lg" className="w-full">
              Применить
            </Button>
          </SheetClose>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
