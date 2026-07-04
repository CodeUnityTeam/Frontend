import React from "react";
import {
  Root,
  Item,
  Indicator,
} from "@radix-ui/react-radio-group";

import { cn } from "@/shared/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn("flex gap-4", className)}
    {...props}
  />
));

RadioGroup.displayName = Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      "grid size-7 shrink-0 place-content-center rounded-full border border-border",
      "ring-offset-background transition-colors",
      "hover:border-primary",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-primary",
      className,
    )}
    {...props}
  >
    <Indicator className="grid place-content-center">
      <div className="size-3 rounded-full bg-primary" />
    </Indicator>
  </Item>
));

RadioGroupItem.displayName = Item.displayName;

export { RadioGroup, RadioGroupItem };