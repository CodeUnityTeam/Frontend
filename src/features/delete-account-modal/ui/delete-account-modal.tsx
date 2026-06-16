import { ConfirmModal } from "@/features/confirm-modal";
import { useDeleteAccount } from "@/features/delete-account-modal/model/delete-account-mutation.ts";
import { toast } from "sonner";

type DeleteAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteAccountModal({
  open,
  onOpenChange
}: DeleteAccountModalProps) {
  const {mutate, } = useDeleteAccount();

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      title="Удалить аккаунт?"
      description="Все данные будут удалены без возможности
  восстановления"
      confirmText="Удалить"
      cancelText="Отменить"
      icon="ph:trash"
      closeOnOutsideClick
      onConfirm={() => {
        mutate(undefined, {
          // TODO: После успешного запроса разлогинить пользователя
          onSuccess: () => {
            alert("Удаление аккаунта в разработке");
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    />
  );
}

export const Component = DeleteAccountModal;

 // TODO - Присоединить API для удаления и удалить лишнюю страницу