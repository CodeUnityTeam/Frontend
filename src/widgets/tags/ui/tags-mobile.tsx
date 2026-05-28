import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTags } from "@/widgets/tags/model/use-tags";
import { tags } from "@/widgets/tags/model/tags";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/shared/ui/dropdown-menu";

export function TagsMobile() {
  const { toggleTag, isTagChecked } = useTags();

  return (
    <div className="block md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="group flex h-12 w-full items-center justify-between rounded-xl border border-border px-4 text-base font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span>Теги</span>
          <Icon
            icon="lucide:chevron-down"
            className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-80 w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          {tags.map((tag) => (
            <label key={tag.id} className="flex cursor-pointer items-center gap-3">
              <Checkbox className="size-5 [&_svg]:size-3.5" checked={isTagChecked(tag.id)} onCheckedChange={() => toggleTag(tag.id)} />
              <span className="text-base text-neutral-700">{tag.label}</span>
            </label>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
