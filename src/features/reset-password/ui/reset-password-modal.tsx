import { Dialog } from "@/shared/ui/dialog";
import { useState } from "react";
import { ResetPasswordForm } from "@/features/reset-password/ui/reset-password-form";
import { ResetPasswordSuccess } from "@/features/reset-password/ui/reset-password-success";
import { resetPasswordApi } from "@/features/reset-password/api/reset-password-api";

type ResetPasswordModalProps = {
  onClose: () => void;
};

export function ResetPasswordModal({ onClose }: ResetPasswordModalProps) {
  const [state, setState] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <div className="flex w-full max-w-xl flex-col gap-0 overflow-hidden rounded-3xl bg-background p-6 sm:p-12">
        {state === "form" ? (
          <ResetPasswordForm
            onSubmit={(submittedEmail: string): void => {
              resetPasswordApi(submittedEmail);
              setEmail(submittedEmail);
              setState("success");
            }}
            onClose={onClose}
          />
        ) : (
          <ResetPasswordSuccess
            email={email}
            onClose={onClose}
            onResend={() => resetPasswordApi(email)}
          />
        )}
      </div>
    </Dialog>
  );
}
