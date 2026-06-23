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
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();
    const [inputValue, setInputValue] = React.useState("");

    const addTag = (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      // не добавлять дубликаты
      if (value.includes(trimmed)) {
        setInputValue("");
        return;
      }
      onChange([...value, trimmed]);
      setInputValue("");
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // добавить элемент на enter или пробел
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === "Backspace") {
        // удалить один элемент, но только если нет текущего инпута
        if (inputValue.length === 0) {
          removeTag(value[value.length - 1]);
        }
      }
    };

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
          <InputGroup>
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
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "min-w-[120px] flex-1 border-0 border-hidden bg-transparent p-1 shadow-none outline-none",
                  inputClassName,
                )}
                {...props}
              />
            </div>
          </InputGroup>
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      </Field>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput };
