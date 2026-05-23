import { tags } from "./tags";

interface TagsListProps {
  isTagChecked: (id: string) => boolean;
  toggleTag: (id: string) => void;
}

export function TagsList({ isTagChecked, toggleTag }: TagsListProps) {
  return (
    <>
      {tags.map((tag) => (
        <label key={tag.id} className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            id={tag.id}
            name={tag.label}
            value={tag.id}
            checked={isTagChecked(tag.id)}
            onChange={() => toggleTag(tag.id)}
            className="h-7 w-7 cursor-pointer rounded-md accent-blue-600"
          />

          <span className="text-base text-neutral-700">{tag.label}</span>
        </label>
      ))}
    </>
  );
}
