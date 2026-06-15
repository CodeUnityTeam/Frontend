import { Link, useNavigate } from "react-router";
import { Icon } from "@iconify/react";

import Avatar from "@/shared/assets/images/avatar.png";
import { ROUTES } from "@/shared/model/routes";
import { currentUser } from "@/shared/config/mock-config";
import { clearTokens } from "@/shared/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/shared/ui/dropdown-menu";

const itemClass = "cursor-pointer gap-2 px-2 py-1 max-md:py-2.5 [&_svg]:size-6";

export function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 outline-none">
        <img
          src={Avatar}
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
          {currentUser.name}
        </DropdownMenuLabel>

        <DropdownMenuItem asChild className={itemClass}>
          <Link to={ROUTES.PROFILE}>
            <Icon icon="ph:user-circle" />
            Личный кабинет
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className={itemClass}>
          <Link to={ROUTES.SETTINGS}>
            <Icon icon="ph:gear-six" />
            Настройки
          </Link>
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
    </DropdownMenu>
  );
}
