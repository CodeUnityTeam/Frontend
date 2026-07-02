import type { Dispatch, SetStateAction } from "react";
import { TagsDesktop } from "./tags-desktop";
import { TagsMobile } from "./tags-mobile";

interface TagsListProps {
  selectedTags: string[];
  onTagsChange: Dispatch<SetStateAction<string[]>>;
}

export function TagsList({ selectedTags, onTagsChange }: TagsListProps) {
  const toggleTag = (value: string) => {
    if (value === "all") {
      onTagsChange([]);
      return;
    }
    onTagsChange((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  return (
    <>
      <TagsDesktop selectedTags={selectedTags} onToggle={toggleTag} />
      <TagsMobile selectedTags={selectedTags} onToggle={toggleTag} />
    </>
  );
}