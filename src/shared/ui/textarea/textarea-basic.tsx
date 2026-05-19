import * as React from "react";

import { cn } from "@/shared/lib/utils";

const TextareaBasic = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // removed md:text-sm
        "flex min-h-[86px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-disabled",
        className,

        // custom styles
        "font-raleway text-[18px] leading-normal",
      )}
      ref={ref}
      {...props}
    />
  );
});

TextareaBasic.displayName = "TextareaBasic";

export { TextareaBasic };
