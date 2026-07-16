import { cva } from "class-variance-authority";

export const buttonVariants = cva(
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
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-sm px-3 py-2 text-sm",
        default: "h-12 rounded-md px-4 py-3 text-base",
        md: "h-10 rounded-md px-4 py-2 text-sm",
        lg: "h-13 rounded-lg px-5 py-4 text-lg font-semibold",
        alertModal:
          "m-0 h-[53px] w-[140.5px] rounded-lg text-[18px] leading-[100%] font-semibold",
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

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
