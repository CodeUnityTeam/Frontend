import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "./styles";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * #### Комбинации для иконок:
 * - **ghost + icon** -- малая иконка 32x32 (Share, Like, Edit Small, etc.).
 * - **outline + icon_lg** -- большая круглая кнопка 48x48 (Circle Button Middle).
 *
 * @example
 *    <Button size="icon_lg" variant="outline" className="">
 *        <Icon icon="ph:telegram-logo" />
 *    </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
