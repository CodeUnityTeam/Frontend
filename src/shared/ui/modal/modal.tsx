import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog";
import { Icon } from "@iconify/react"
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
      <DialogContent showCloseButton={false} className={cn(
        "flex max-h-[90vh] flex-col overflow-hidden gap-0 sm:rounded-[24px] sm:p-8",
        className,
      )}>
        {children}
      </DialogContent>
    </Dialog>
  );
}


export const ModalHeader = ({ children, className }: ModalSlotProps) => {
  return (
    <DialogHeader className={cn(
      "flex flex-row items-center justify-between space-y-0 gap-1 pb-6",
      className
    )}>
      <div className="flex-1">
        {children}
      </div>
      <DialogClose>
        <Icon icon="ph:x" height={24} />
        <span className="sr-only">Close modal</span>
      </DialogClose>
    </DialogHeader>
  );
};

export const ModalTitle = ({ 
  children, 
  className 
}: ModalSlotProps) => {
  return (
    <DialogTitle className={cn(
      "text-[20px] sm:text-4xl leading-[130%]",
      className
    )}>
      {children}
    </DialogTitle>
  );
};

export const ModalDescription = ({
  children,
  className,
}: ModalSlotProps) => (
  <DialogDescription className={className}>
    {children}
  </DialogDescription>
);

export const ModalBody = ({ children, className }: ModalSlotProps) => {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto no-scrollbar max-h-[744px]", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ 
  children, 
  className 
}: ModalSlotProps) => {
  return (
    <DialogFooter className={cn(
      "flex-row justify-center gap-2 sm:justify-center sm:space-x-0 pt-8",
      className
    )}>
      {children}
    </DialogFooter>
  );
};

