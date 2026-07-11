import { Button } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Tag } from "@/shared/ui/tag";

const SEARCH_TAGS_LIMIT = 10;

interface SearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function Search({ onSearch, placeholder = 'Поиск' }: SearchProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string[]>([]);
  const isMobile = window.innerWidth < 768;

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;

    setSearchTag((prev) => {
      const filtered = prev.filter(
        (tag) => tag.toLowerCase() !== trimmed.toLowerCase(),
      );
      return [trimmed, ...filtered].slice(0, SEARCH_TAGS_LIMIT);
    });
    onSearch(trimmed);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value) {
      onSearch("");
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
    onSearch(tag)
  }

  return (
    <div className="my-2 md:my-8.5 flex flex-col justify-start py-4">
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
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder={isMobile ? "Поиск" : placeholder}
        />
        <InputGroupAddon align="inline-end">
          {isMobile ? (
            <></>
          ) : (
            <Button
              className="mx-6 my-3 rounded-[12px] px-8 py-3"
              variant="outline"
              size="md"
              onClick={handleSearch}
            >
              Найти
            </Button>
          )}
        </InputGroupAddon>
      </InputGroup>
      {
        !isMobile && (<div className="mt-3 flex flex-wrap gap-2">
          {searchTag.map((tag) => (
            <Tag
              className="cursor-pointer text-sm"
              variant="outline"
              key={tag}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>)
      }
    </div>
  );
}
