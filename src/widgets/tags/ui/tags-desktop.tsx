import { useTags } from "@/widgets/tags/model/use-tags";
import { tags } from "@/widgets/tags/model/tags";
import { Checkbox } from "@/shared/ui/checkbox";

export function TagsDesktop() {
  const { toggleTag, isTagChecked } = useTags();

  return (
    <div className="hidden md:flex md:flex-col">
      <h2 className="mb-6 text-2xl font-semibold">Теги</h2>

      <div className="flex flex-col gap-3">
        {tags.map((tag) => (
          <label key={tag.value} className="flex cursor-pointer items-center gap-3">
            <Checkbox className="size-5 [&_svg]:size-3.5" checked={isTagChecked(tag.value)} onCheckedChange={() => toggleTag(tag.value)} />
            <span className="text-base text-neutral-700">{tag.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
