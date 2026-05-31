import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/shared/ui/alert-dialog'
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

type AlertModalSlotProps = {
  children?: ReactNode;
  className?: string;
};

type AlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function AlertModal({ open, onOpenChange, children, className }: AlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "max-w-[360px] overflow-hidden gap-5 pt-6 pb-5 px-8 rounded-[16px]",
        className,
      )}>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const AlertModalHeader = ({ children, className }: AlertModalSlotProps) => {
  return (
    <AlertDialogHeader className={cn(
      "items-center text-center sm:text-center gap-1",
      className
    )}>
      {children}
    </AlertDialogHeader>
  );
};

export const AlertModalTitle = ({ children, className }: AlertModalSlotProps) => {
  return (
    <AlertDialogTitle className={cn(
      "text-[26px] leading-[32px] font-bold m-0",
      className
    )}>
      {children}
    </AlertDialogTitle>
  );
};

export const AlertModalDescription = ({ children, className }: AlertModalSlotProps) => (
  <AlertDialogDescription className={cn("text-[18px] text-foreground ", className)}>
    {children}
  </AlertDialogDescription>
);

export const AlertModalFooter = ({ children, className }: AlertModalSlotProps) => {
  return (
    <AlertDialogFooter className={cn(
      "flex-row justify-center gap-2 sm:justify-center sm:space-x-0",
      className
    )}>
      {children}
    </AlertDialogFooter>
  );
};

export const AlertModalAction = ({ children, className }: AlertModalSlotProps) => (
  <AlertDialogAction className={cn(
    "rounded-[16px] text-[16px] leading-[21px] font-semibold py-4 px-9 h-auto bg-alert-modal-button-bg hover:bg-alert-modal-button-bg/90", 
    className
  )}>
    {children}
  </AlertDialogAction>
);

export const AlertModalCancel = ({ children, className }: AlertModalSlotProps) => (
  <AlertDialogCancel className={cn(
    "rounded-[16px] text-[16px] leading-[21px] font-semibold py-4 px-[29px] m-0 h-auto border-alert-modal-button-border focus-visible:border-focused]", 
    className
  )}>
    {children}
  </AlertDialogCancel>
);