import * as React from "react";

import { Field, FieldError, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { cn } from "@/shared/lib/utils";

interface InputProps extends React.ComponentPropsWithoutRef<
  typeof InputGroupInput
> {
  /** Input Label text */
  label?: string;
  /** Left icon/element in the input field
   *
   * @example
   *   <Input leftElement={<Icon icon="ph:smiley" />}/>
   */
  leftElement?: React.ReactNode;
  /** right icon or button in the input field
   *
   *  @example
   *  <Input RightElement={<Button>Search</Button>}/>
   */
  rightElement?: React.ReactNode;
  /** Input error message */
  error?: string;
}

/** Input component with integrated Label, Error message block, and input field addons(left/right icons/buttons) */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, leftElement, rightElement, error, className, type, ...props },
    ref,
  ) => {
    const generatedId = React.useId();

    return (
      <Field>
        {label && <FieldLabel htmlFor={generatedId}>{label}</FieldLabel>}
        <InputGroup className={cn("h-12", className)}>
          {leftElement && <InputGroupAddon>{leftElement}</InputGroupAddon>}
          <InputGroupInput type={type} {...props} id={generatedId} ref={ref} />
          {rightElement && (
            <InputGroupAddon align="inline-end">{rightElement}</InputGroupAddon>
          )}
        </InputGroup>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  },
);

Input.displayName = "Input";

export { Input };
