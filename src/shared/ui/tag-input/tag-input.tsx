import React from "react";
import {
  FieldDescription,
  FieldLabel,
  FieldError,
  Field,
  FieldContent,
} from "@/shared/ui/field";
import { InputGroup, InputGroupInput } from "@/shared/ui/input/input-group";
import { Tag } from "@/shared/ui/tag";
import { cn } from "@/shared/lib/utils";

interface TagInputProps {
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  value: string[];
  onChange: (newValue: string[]) => void;
  tagsContainerClassName?: string;
  groupClassName?: string;
  suggestions?: string[];
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      label,
      description,
      error,
      placeholder,
      className,
      inputClassName,
      value,
      onChange,
      tagsContainerClassName,
      groupClassName,
      suggestions,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();
    const [inputValue, setInputValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const canonicalize = (raw: string) => {
      const trimmed = raw.trim();
      if (!suggestions) return trimmed;
      return (
        suggestions.find((s) => s.toLowerCase() === trimmed.toLowerCase()) ??
        trimmed
      );
    };

    const addTag = (tag: string) => {
      const trimmed = canonicalize(tag);
      if (!trimmed) return;

      if (value.includes(trimmed)) {
        setInputValue("");
        return;
      }
      onChange([...value, trimmed]);
      setInputValue("");
    };

    const commitInput = (raw: string) => {
      const parts = raw
        .split(",")
        .map((part) => canonicalize(part))
        .filter(Boolean);

      if (parts.length === 0) {
        setInputValue("");
        return;
      }

      const next = [...value];
      for (const part of parts) {
        if (!next.includes(part)) {
          next.push(part);
        }
      }
      if (next.length !== value.length) {
        onChange(next);
      }
      setInputValue("");
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commitInput(inputValue);
      } else if (e.key === "Backspace") {
        if (inputValue.length === 0) {
          removeTag(value[value.length - 1]);
        }
      }
    };

    const handleInputChange = (raw: string) => {
      if (raw.includes(",")) {
        commitInput(raw);
      } else {
        setInputValue(raw);
      }
    };

    const query = inputValue.trim().toLowerCase();
    const matches =
      suggestions && query
        ? suggestions
            .filter(
              (s) => s.toLowerCase().includes(query) && !value.includes(s),
            )
            .slice(0, 8)
        : [];
    const showSuggestions = isFocused && matches.length > 0;

    return (
      <Field orientation="vertical" className={cn("gap-1 md:gap-5", className)}>
        <div className="flex flex-col gap-2">
          {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
          {description && (
            <FieldDescription id={inputId} className="hidden md:block">
              {description}
            </FieldDescription>
          )}
        </div>
        <FieldContent>
          <div className="relative">
            <InputGroup className={groupClassName}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 rounded-md bg-background px-3 py-2",
                  "min-h-15 w-full",
                  tagsContainerClassName,
                )}
              >
                {value.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
                <InputGroupInput
                  ref={ref}
                  id={inputId}
                  type="text"
                  placeholder={value.length === 0 ? placeholder : ""}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    commitInput(inputValue);
                  }}
                  className={cn(
                    "min-w-[120px] flex-1 border-0 border-hidden bg-transparent p-1 shadow-none outline-none",
                    inputClassName,
                  )}
                  {...props}
                />
              </div>
            </InputGroup>
            {showSuggestions && (
              <ul
                className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-input bg-background py-1 shadow-md"
                onMouseDown={(e) => e.preventDefault()}
              >
                {matches.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-base hover:bg-secondary-hover"
                      onClick={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      </Field>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput };
