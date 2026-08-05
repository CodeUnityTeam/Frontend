import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";

import { useFilters } from "../model/filters-context";

type ReferenceItemView = { id: string; name: string };

type ReferenceFilterSectionProps = {
  title: string;
  sectionId: string;
  items: ReferenceItemView[] | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  scrollable?: boolean;
  searchSectionId?: string;
};

export function ReferenceFilterSection({
  title,
  sectionId,
  items,
  isPending,
  isError,
  onRetry,
  searchable = false,
  searchPlaceholder = "Поиск",
  scrollable = false,
  searchSectionId,
}: ReferenceFilterSectionProps) {
  const { isChecked, toggle, search, setSearch } = useFilters();
  const [open, setOpen] = useState(true);
  const searchKey = searchSectionId || sectionId;
  const searchValue = search[searchKey] || "";

  const visibleItems = useMemo(() => {
    if (!items) {
      return [];
    }
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchValue]);

  return (
    <section
      className={cn(
        "flex flex-col gap-2",
        scrollable ? "h-full min-h-0" : "shrink-0",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full shrink-0 cursor-pointer items-center justify-between py-1 text-left"
      >
        <span className="text-xl leading-[1.3] font-semibold text-foreground">
          {title}
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
        <div
          className={cn(
            "flex flex-col gap-2",
            scrollable && "min-h-0 flex-1",
          )}
        >
          {searchable && (
            <div className="relative shrink-0">
              <Icon
                icon="ph:magnifying-glass"
                className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearch(searchKey, event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-input bg-background py-1.5 pr-3 pl-10 text-[16px] text-foreground outline-none focus-visible:border-primary"
              />
            </div>
          )}

          {isPending && (
            <p className="shrink-0 py-2 text-[16px] text-muted-foreground">
              Загрузка…
            </p>
          )}

          {isError && (
            <div className="flex shrink-0 flex-col items-start gap-1 py-2">
              <p className="text-[16px] text-muted-foreground">
                Не удалось загрузить.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer text-[16px] font-semibold text-primary"
              >
                Повторить
              </button>
            </div>
          )}

          {!isPending && !isError && (
            <ul
              className={cn(
                scrollable &&
                  "min-h-0 flex-1 overflow-y-auto overscroll-contain",
              )}
            >
              {visibleItems.length === 0 ? (
                <li className="py-1 text-[16px] text-muted-foreground">
                  {search ? "Ничего не найдено" : "Список пуст"}
                </li>
              ) : (
                visibleItems.map((item) => (
                  <li key={item.id} className="py-1">
                    <label className="flex h-7 cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={isChecked(sectionId, item.id)}
                        onCheckedChange={() => toggle(sectionId, item.id)}
                      />
                      <span className="text-[18px] leading-normal text-foreground">
                        {item.name}
                      </span>
                    </label>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
