import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import Avatar from "@/shared/assets/images/avatar.png";
import { ROUTES } from "@/shared/model/routes";
import { useCurrentProfile } from "@/entities/profile";
import { clearTokens } from "@/shared/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/shared/ui/dropdown-menu";
import { DeleteAccountModal } from "@/features/delete-account-modal";
import { useModal } from "@/shared/lib/hooks/use-modal";
import { ChangePasswordModal } from "@/features/change-password-modal";
import { ChangeEmailModal } from "@/features/change-email-modal";

const itemClass = "cursor-pointer gap-2 px-2 py-1 max-md:py-2.5 [&_svg]:size-6";

export function ProfileMenu() {
  const navigate = useNavigate();
  const deleteModal = useModal();
  const changePasswordModal = useModal();
  const changeEmailModal = useModal();
  const profileQuery = useCurrentProfile();

  const profile = profileQuery.data;
  const fullName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ")
    : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 outline-none">
        <img
          src={profile?.avatar_url || Avatar}
          alt="avatar"
          className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
        />
        <span className="hidden text-lg font-semibold md:inline">Профиль</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        sideOffset={12}
        collisionPadding={16}
        className="flex w-60 flex-col gap-2 rounded-md p-2 max-md:w-70"
      >
        <DropdownMenuLabel className="py-1 pl-10">
          {fullName || "Профиль"}
        </DropdownMenuLabel>

        <DropdownMenuItem asChild className={itemClass}>
          <Link to={ROUTES.PROFILE}>
            <Icon icon="ph:user-circle" />
            Личный кабинет
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className={itemClass}
          onSelect={() => setTimeout(changePasswordModal.openModal, 0)}
        >
          <Icon icon="ph:password" />
          Изменить пароль
        </DropdownMenuItem>

        <DropdownMenuItem
          className={itemClass}
          onSelect={() => setTimeout(changeEmailModal.openModal, 0)}
        >
          <Icon icon="ph:envelope-simple" />
          Изменить E-mail
        </DropdownMenuItem>

        <DropdownMenuItem
          className={itemClass}
          onSelect={() => setTimeout(deleteModal.openModal, 0)}
        >
          <Icon icon="ph:trash" />
          Удалить профиль
        </DropdownMenuItem>

        <DropdownMenuItem
          className={itemClass}
          onSelect={() => {
            clearTokens();
            navigate(ROUTES.HOME);
          }}
        >
          <Icon icon="ph:sign-out" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>

      <DeleteAccountModal
        open={deleteModal.open}
        onOpenChange={deleteModal.setOpen}
        onConfirm={deleteModal.closeModal}
      />
      <ChangePasswordModal
        open={changePasswordModal.open}
        onOpenChange={changePasswordModal.setOpen}
      />
      <ChangeEmailModal
        open={changeEmailModal.open}
        onOpenChange={changeEmailModal.setOpen}
      />
    </DropdownMenu>
  );
}
