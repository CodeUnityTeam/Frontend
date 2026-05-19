import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Field, FieldError, FieldLabel } from "../field";
import { InputGroup, InputGroupTextarea } from "../input/input-group";
import type { TextareaBasic } from "./textarea-basic";

interface TextareaProps extends React.ComponentPropsWithoutRef<
  typeof TextareaBasic
> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, error, ...props }, ref) => {
    const generatedId = React.useId();

    return (
      <Field>
        {label && <FieldLabel htmlFor={generatedId}>{label}</FieldLabel>}
        <InputGroup className={cn(className)}>
          <InputGroupTextarea {...props} id={generatedId} ref={ref} />
        </InputGroup>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
