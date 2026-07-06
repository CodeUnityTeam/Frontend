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
  isLoading?: boolean;
  loadingText?: string;
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
  isLoading = false,
  loadingText,
}: ConfirmModalProps) {
  const confirmLabel = isLoading ? loadingText ?? confirmText : confirmText;

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
        <AlertModalAction onClick={onConfirm} disabled={isLoading}>
          {confirmLabel}
        </AlertModalAction>

        <AlertModalCancel disabled={isLoading}>{cancelText}</AlertModalCancel>
      </AlertModalFooter>
    </AlertModal>
  );
}
