import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/shared/ui/alert-dialog";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

import { buttonVariants } from "@/shared/ui/button/button";

type AlertModalSlotProps = {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "ghost";
};

type AlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
};

export function AlertModal({
  open,
  onOpenChange,
  children,
  className,
  closeOnOutsideClick = false,
}: AlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        overlayProps={
          closeOnOutsideClick
            ? {
                onPointerDown: () => onOpenChange(false),
              }
            : undefined
        }
        className={cn(
          "max-w-[360px] gap-5 overflow-hidden px-8 pt-6 pb-5",
          className,
        )}
      >
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const AlertModalHeader = ({
  children,
  className,
}: AlertModalSlotProps) => {
  return (
    <AlertDialogHeader
      className={cn("items-center gap-1 text-center sm:text-center", className)}
    >
      {children}
    </AlertDialogHeader>
  );
};

export const AlertModalTitle = ({
  children,
  className,
}: AlertModalSlotProps) => {
  return (
    <AlertDialogTitle
      className={cn("m-0 text-[26px] leading-[32px] font-bold", className)}
    >
      {children}
    </AlertDialogTitle>
  );
};

export const AlertModalDescription = ({
  children,
  className,
}: AlertModalSlotProps) => (
  <AlertDialogDescription
    className={cn("text-[18px] text-foreground", className)}
  >
    {children}
  </AlertDialogDescription>
);

export const AlertModalFooter = ({
  children,
  className,
}: AlertModalSlotProps) => {
  return (
    <AlertDialogFooter
      className={cn(
        "flex-row justify-center gap-2 sm:justify-center sm:space-x-0",
        className,
      )}
    >
      {children}
    </AlertDialogFooter>
  );
};

export const AlertModalAction = ({
  children,
  className,
  asChild,
  onClick,
  ...props
}: AlertModalSlotProps) => (
  <AlertDialogAction
    className={cn(
      buttonVariants({
        variant: "destructive",
        size: "alertModal",
      }),
      className,
    )}
    asChild={asChild}
    onClick={onClick}
    {...props}
  >
    {children}
  </AlertDialogAction>
);

export const AlertModalCancel = ({
  children,
  className,
  ...props
}: AlertModalSlotProps) => (
  <AlertDialogCancel
    className={cn(
      buttonVariants({
        variant: "outline",
        size: "alertModal",
      }),
      className,
    )}
    {...props}
  >
    {children}
  </AlertDialogCancel>
);
