import { useState } from "react";

export function useTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (value: string) => {
    if (value === "all") {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((itemId) => itemId !== value)
        : [...prev, value],
    );
  };

  const isTagChecked = (value: string) => {
    return value === "all" ? selectedTags.length === 0 : selectedTags.includes(value);
  };

  return {
    selectedTags,
    toggleTag,
    isTagChecked,
  };
}
