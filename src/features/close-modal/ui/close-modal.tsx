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

type CloseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CloseModal ({ open, onOpenChange }: CloseModalProps) {
  return (
    <AlertModal open={open} onOpenChange={onOpenChange}>
      <AlertModalHeader>
        <Icon icon="ph:warning-octagon" height={64} className="mb-1" />
        <AlertModalTitle>Закрыть форму?</AlertModalTitle>
        <AlertModalDescription>
          Это действие приведёт к безвозвратному удалению всех несохранённых изменений
        </AlertModalDescription>
      </AlertModalHeader>
      <AlertModalFooter>
        <AlertModalAction>Закрыть</AlertModalAction>
        <AlertModalCancel>Отменить</AlertModalCancel>
      </AlertModalFooter>
    </AlertModal>
  )
}