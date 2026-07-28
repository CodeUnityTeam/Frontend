import { useState } from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui/button";
import { InviteUserModal } from "./invite-user-modal";

type InviteUserButtonProps = {
  userId: string;
};

export function InviteUserButton({
  userId,
}: InviteUserButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        className="flex w-full items-center justify-center gap-1 rounded-xl border border-primary py-2 text-[16px] font-semibold"
        onClick={() => setOpen(true)}
      >
        <Icon icon="ph:paper-plane-tilt" className="text-xl" />
        <span>Пригласить</span>
      </Button>

      <InviteUserModal
        open={open}
        onOpenChange={setOpen}
        userId={userId}
      />
    </>
  );
}