import { useState } from "react";

export function useTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (id: string) => {
    if (id === "all") {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const isTagChecked = (id: string) => {
    return id === "all" ? selectedTags.length === 0 : selectedTags.includes(id);
  };

  return {
    selectedTags,
    toggleTag,
    isTagChecked,
  };
}
