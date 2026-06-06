import { useState } from "react";

/**
 * Локальное состояние формы создания вопроса: заголовок, текст, выбранные теги,
 * флаг анонимной публикации. Бизнес-логики отправки тут нет — только UI-state.
 */
export function useCreateQuestion() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);

  const toggleTag = (value: string) =>
    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

  const isTagSelected = (value: string) => selectedTags.includes(value);

  const reset = () => {
    setTitle("");
    setDetails("");
    setSelectedTags([]);
    setAnonymous(false);
  };

  return {
    title,
    setTitle,
    details,
    setDetails,
    selectedTags,
    toggleTag,
    isTagSelected,
    anonymous,
    setAnonymous,
    reset,
  };
}
