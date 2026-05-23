import { useState } from "react";
import { useTags } from "./useTags";
import { TagsList } from "./Tags_List";

export function TagsMobile() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { toggleTag, isTagChecked } = useTags();

  return (
    <div className="block md:hidden">
      <button
        type="button"
        onClick={() => setIsDropDownOpen((prev) => !prev)}
        className="flex h-24 w-full items-center justify-between rounded-[28px] border border-neutral-400 px-8 text-4xl"
      >
        <span>Теги</span>
        <span>{isDropDownOpen ? "⌃" : "⌄"}</span>
      </button>

      {isDropDownOpen && (
        <div className="mt-3 flex flex-col gap-3 rounded-2xl border bg-white p-4">
          <TagsList toggleTag={toggleTag} isTagChecked={isTagChecked} />
        </div>
      )}
    </div>
  );
}
