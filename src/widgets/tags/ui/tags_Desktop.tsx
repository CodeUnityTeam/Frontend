import { useTags } from "./useTags";
import { TagsList } from "./Tags_List";

export function TagsDesktop() {
  const { toggleTag, isTagChecked } = useTags();

  return (
    <div className="hidden md:flex md:flex-col">
      <h2 className="mb-6 text-2xl font-semibold">Теги</h2>

      <div className="flex flex-col gap-3">
        <TagsList toggleTag={toggleTag} isTagChecked={isTagChecked} />
      </div>
    </div>
  );
}
