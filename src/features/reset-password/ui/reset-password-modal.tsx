import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { ResetPasswordForm } from "@/features/reset-password/ui/reset-password-form";
import { ResetPasswordSuccess } from "@/features/reset-password/ui/reset-password-success";
import { useResetPassword } from "@/features/reset-password/model/use-reset-mutation";

type ResetPasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
};

export function ResetPasswordModal({
  open,
  onClose,
  onBack,
}: ResetPasswordModalProps) {
  const [state, setState] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useResetPassword();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setState("form");
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex w-full max-w-xl flex-col gap-0 overflow-hidden rounded-3xl bg-background p-6 sm:p-12"
      >
        {state === "form" ? (
          <ResetPasswordForm
            onSubmit={(submittedEmail: string): void => {
              mutate(submittedEmail, {
                onSuccess: () => {
                  setEmail(submittedEmail);
                  setState("success");
                },
                onError: (error) => toast.error(error.message),
              });
            }}
            isPending={isPending}
            onBack={() => {
              setState("form");
              onBack();
            }}
          />
        ) : (
          <ResetPasswordSuccess
            email={email}
            onClose={() => {
              setState("form");
              onClose();
            }}
            onResend={() => mutate(email)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
