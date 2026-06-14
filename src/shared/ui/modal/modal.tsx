import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog";
import { Icon } from "@iconify/react";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

type ModalSlotProps = {
  children?: ReactNode;
  className?: string;
};

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onOpenChange, children, className }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[90vh] max-w-auto flex-col gap-0 overflow-hidden sm:p-8",
          className,
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export const ModalHeader = ({ children, className }: ModalSlotProps) => {
  return (
    <DialogHeader
      className={cn(
        "flex flex-row items-center justify-between gap-1 space-y-0 pb-6",
        className,
      )}
    >
      <div className="flex-1">{children}</div>
      <DialogClose>
        <Icon icon="ph:x" height={24} />
        <span className="sr-only">Close modal</span>
      </DialogClose>
    </DialogHeader>
  );
};

export const ModalTitle = ({ children, className }: ModalSlotProps) => {
  return (
    <DialogTitle
      className={cn("text-[20px] leading-[130%] sm:text-4xl", className)}
    >
      {children}
    </DialogTitle>
  );
};

export const ModalDescription = ({ children, className }: ModalSlotProps) => (
  <DialogDescription className={className}>{children}</DialogDescription>
);

export const ModalBody = ({ children, className }: ModalSlotProps) => {
  return (
    <div
      className={cn("flex-1 min-h-0 overflow-y-auto no-scrollbar", className)}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className }: ModalSlotProps) => {
  return (
    <DialogFooter
      className={cn(
        "flex-row justify-center gap-2 pt-8 sm:justify-center sm:space-x-0",
        className,
      )}
    >
      {children}
    </DialogFooter>
  );
};
