import { Button } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { mockTags } from "@/widgets/search/model/tags-data";
import { Tag } from "@/shared/ui/tag";

const SEARCH_TAGS_LIMIT = 10;

export function Search() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string[]>(mockTags);
  const isMobile = window.innerWidth < 768;

  const handleSearch = () => {
    if (!searchValue.trim()) {
      return;
    }
    setSearchTag((prev) => {
      const filtered = prev.filter(
        (tag) => tag.toLowerCase() !== searchValue.toLowerCase(),
      );
      return [searchValue, ...filtered].slice(0, SEARCH_TAGS_LIMIT);
    });
    setSearchValue("");
  };

  return (
    <div className="my-8.5 flex flex-col justify-start px-20 py-4 max-md:px-5">
      <InputGroup
        className={isMobile ? "h-14 rounded-[28px]" : "h-18 rounded-[28px]"}
      >
        <InputGroupAddon className="ml-4.5">
          <Icon icon="boxicons:search" className="size-6"></Icon>
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          className={isMobile ? "h-14" : "h-7"}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder={isMobile ? "Поиск" : "Поиск проектов и команд"}
        />
        <InputGroupAddon align="inline-end">
          {isMobile ? (
            <></>
          ) : (
            <Button
              className="mx-6 my-3 rounded-[12px] px-8 py-3"
              variant="outline"
              size="default"
              onClick={() => {
                handleSearch();
              }}
            >
              Найти
            </Button>
          )}
        </InputGroupAddon>
      </InputGroup>
      <div className="mt-3 flex flex-wrap gap-2">
        {searchTag.map((tag) => <Tag className="text-sm" variant="outline" key={tag}>{tag}</Tag>)}
      </div>
    </div>
  );
}
