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


type ModalHeaderProps = {
  children?: ReactNode;
  className?: string;
};

export const ModalHeader = ({ children, className }: ModalHeaderProps) => {
  return (
    <DialogHeader className={cn(
      "flex flex-row items-center justify-between space-y-0 gap-1 pb-6",
      className
    )}>
      <div className="flex-1">
        {children}
      </div>
      <DialogClose>
        <Icon icon="ph:x" height="24px" className="cursor-pointer" />
      </DialogClose>
    </DialogHeader>
  );
};

export const ModalTitle = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <DialogTitle className={cn(
      "text-[20px] sm:text-4xl leading-[130%]",
      className
    )}>
      {children}
    </DialogTitle>
  );
};

export const ModalDescription = DialogDescription;

export const ModalFooter = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <DialogFooter className={cn(
      "flex flex-row items-center justify-center gap-2 sm:justify-center sm:space-x-0 pt-8",
      className
    )}>
      {children}
    </DialogFooter>
  );
};

type ModalBodyProps = {
  children: ReactNode;
  className?: string;
};

export const ModalBody = ({ children, className }: ModalBodyProps) => {
  return (
    <div className={cn("flex flex-1 justify-center overflow-y-auto", className)}>
      {children}
    </div>
  );
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
        [
          "flex",
          "max-h-[90vh]",
          "flex-col",
          "overflow-hidden",
          "sm:rounded-[24px]",
          "sm:p-8",
          "gap-0",
        ],
        className,
      )}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
