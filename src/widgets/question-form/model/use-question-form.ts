import { useState } from "react";

import type { QuestionFormValues, QuestionTag } from "@/entities/question";

export function useQuestionForm(initialValues: QuestionFormValues) {
  const [title, setTitle] = useState(initialValues.title);
  const [details, setDetails] = useState(initialValues.details);
  const [selectedTags, setSelectedTags] = useState<QuestionTag[]>(
    initialValues.tags,
  );

  const toggleTag = (value: QuestionTag) =>
    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

  const isTagSelected = (value: QuestionTag) => selectedTags.includes(value);

  const getValues = (): QuestionFormValues => ({
    title,
    details,
    tags: selectedTags,
  });

  return {
    title,
    setTitle,
    details,
    setDetails,
    selectedTags,
    toggleTag,
    isTagSelected,
    getValues,
  };
}
