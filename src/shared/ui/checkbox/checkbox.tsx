import React from "react";
import { Root, Indicator } from "@radix-ui/react-checkbox";

import { cn } from "@/shared/lib/utils";
import { Icon } from "@iconify/react";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "grid size-7 shrink-0 place-content-center rounded-xs border border-border ring-offset-background transition-colors hover:border-primary hover:bg-secondary-hover focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-disabled-foreground disabled:bg-disabled data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground disabled:data-[state=checked]:border-disabled-foreground disabled:data-[state=checked]:bg-disabled disabled:data-[state=checked]:text-disabled-foreground",
      className,
    )}
    {...props}
  >
    <Indicator className={cn("grid place-content-center text-current")}>
      <Icon icon="lucide:check" className="size-6" />
    </Indicator>
  </Root>
));
Checkbox.displayName = Root.displayName;

export { Checkbox };
