import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:bg-focused focus-visible:ring-0 active:bg-primary-pressed disabled:bg-disabled",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-pressed/90 focus-visible:bg-destructive-pressed focus-visible:ring-0 active:bg-destructive-pressed disabled:bg-disabled",
        outline:
          "border border-primary bg-background text-foreground hover:bg-secondary-hover focus-visible:border-focused active:border-secondary-pressed-border active:bg-secondary-pressed disabled:border-disabled disabled:bg-disabled-muted",
        // secondary:
        //   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent hover:text-primary focus-visible:text-focused active:text-secondary-pressed-border disabled:text-disabled",
        // link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-sm px-3 py-2 text-sm",
        default: "h-12 rounded-md px-4 py-3 text-base",
        lg: "h-13 rounded-lg px-5 py-4 text-lg font-semibold",
        alertModal: "h-[53px] w-[140.5px] rounded-lg font-semibold leading-[100%] text-[18px] m-0",
        icon: "size-8 rounded-sm p-2.5",
        icon_lg: "size-12 rounded-full p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

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
 *        <Icon icon="ph:telegram-logo"></Icon>
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

export { Button, buttonVariants };
