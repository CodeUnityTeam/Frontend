import {
  AlertModal,
  AlertModalHeader,
  AlertModalTitle,
  AlertModalDescription,
  AlertModalFooter,
  AlertModalAction,
  AlertModalCancel,
} from "@/shared/ui/modal/alert-modal";
import { Icon } from "@iconify/react";

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  icon?: string;
  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm?: () => void;
  variant?: "default" | "destructive";
  closeOnOutsideClick?: boolean;
};

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  icon,
  onConfirm,
  closeOnOutsideClick,
}: ConfirmModalProps) {
  return (
    <AlertModal
      open={open}
      onOpenChange={onOpenChange}
      closeOnOutsideClick={closeOnOutsideClick}
    >
      <AlertModalHeader>
        {icon && <Icon icon={icon} height={64} className="mb-1" />}

        <AlertModalTitle>{title}</AlertModalTitle>

        <AlertModalDescription>{description}</AlertModalDescription>
      </AlertModalHeader>

      <AlertModalFooter>
        <AlertModalAction onClick={onConfirm}>{confirmText}</AlertModalAction>

        <AlertModalCancel>{cancelText}</AlertModalCancel>
      </AlertModalFooter>
    </AlertModal>
  );
}
