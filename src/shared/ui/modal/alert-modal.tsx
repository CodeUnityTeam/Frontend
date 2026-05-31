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
import { Icon } from "@iconify/react"
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
        "max-w-[360px] flex-col overflow-hidden gap-0 sm:rounded-[16px] sm:p-8",
        className,
      )}>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}