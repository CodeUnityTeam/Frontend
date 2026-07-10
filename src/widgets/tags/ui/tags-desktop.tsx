import { tags } from "@/widgets/tags/model/tags";
import { Checkbox } from "@/shared/ui/checkbox";

interface TagsProps {
  selectedTags: string[];
  onToggle: (value: string) => void;
}

export function TagsDesktop({ selectedTags, onToggle }: TagsProps) {
  const isTagChecked = (v: string) =>
    v === "all" ? selectedTags.length === 0 : selectedTags.includes(v);

  return (
    <div className="hidden md:flex md:flex-col">
      <h2 className="mb-6 text-2xl font-semibold">Теги</h2>

      <div className="flex flex-col gap-3">
        {tags.map((tag) => (
          <label key={tag.value} className="flex cursor-pointer items-center gap-3">
            <Checkbox className="size-5 [&_svg]:size-3.5" checked={isTagChecked(tag.value)} onCheckedChange={() => onToggle(tag.value)} />
            <span className="text-base text-neutral-700">{tag.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
