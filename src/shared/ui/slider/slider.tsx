import React from "react";
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";

import { cn } from "@/shared/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-(--color-light-gray-200)">
      <Range className="absolute h-full bg-primary" />
    </Track>
    <Thumb className="block size-[18px] shrink-0 cursor-pointer rounded-full border-[3px] border-primary bg-background ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none" />
  </Root>
));
Slider.displayName = Root.displayName;

export { Slider };
