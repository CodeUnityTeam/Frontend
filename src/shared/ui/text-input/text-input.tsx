import React from "react";
import {
  FieldDescription,
  FieldLabel,
  FieldError,
  Field,
  FieldContent,
} from "../field";
import { InputGroup, InputGroupInput } from "../input/input-group";
import { cn } from "@/shared/lib/utils";

interface TextInputProps extends React.ComponentProps<"input"> {
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      description,
      error,
      placeholder,
      className,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    const inputId = React.useId();

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
            <InputGroupInput
              ref={ref}
              id={inputId}
              placeholder={placeholder}
              className={cn("h-15", inputClassName)}
              {...props}
            />
          </InputGroup>
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
      </Field>
    );
  },
);

TextInput.displayName = "TextInput";

export { TextInput };
