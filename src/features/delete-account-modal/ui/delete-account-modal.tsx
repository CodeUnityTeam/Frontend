import { useNavigate } from "react-router";
import { ConfirmModal } from "@/features/confirm-modal";
import { useDeleteAccount } from "@/features/delete-account-modal/model/delete-account-mutation";
import { clearTokens } from "@/shared/lib/auth";
import { ROUTES } from "@/shared/model/routes";
import { toast } from "sonner";

type DeleteAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountModal({
  open,
  onOpenChange,
}: DeleteAccountModalProps) {
  const { mutate } = useDeleteAccount();
  const navigate = useNavigate();

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
          onSuccess: (info) => {
            clearTokens();
            navigate(ROUTES.HOME);
            toast.success(info.detail)
          },
          onError: (error) => toast.error(error.message),
        });
      }}
    />
  );
}

export const Component = DeleteAccountModal;