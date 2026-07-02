import { Icon } from "@iconify/react";
import { tags } from "@/widgets/tags/model/tags";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/shared/ui/dropdown-menu";

interface TagsProps {
  selectedTags: string[];
  onToggle: (value: string) => void;
}

export function TagsMobile({ selectedTags, onToggle }: TagsProps) {
  const isTagChecked = (v: string) =>
    v === "all" ? selectedTags.length === 0 : selectedTags.includes(v);

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
            <label key={tag.value} className="flex cursor-pointer items-center gap-3">
              <Checkbox className="size-5 [&_svg]:size-3.5" checked={isTagChecked(tag.value)} onCheckedChange={() => onToggle(tag.value)} />
              <span className="text-base text-neutral-700">{tag.label}</span>
            </label>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
