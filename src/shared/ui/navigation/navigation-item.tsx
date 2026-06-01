import clsx from "clsx";
import { NavLink } from "react-router";
import type { NavigationItem } from "./navigation-types";

interface Props {
  item: NavigationItem;
  linkClassName?: string;
  activeLinkClassName?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function NavigationItem({
  item,
  linkClassName,
  activeLinkClassName,
  disabled,
  onClick
}: Props) {
  return (
    <NavLink
      to={item.id}
      onClick={onClick}
      aria-label={`Перейти на страницу ${item.label}`}
      className={({ isActive }) =>
        clsx(
          linkClassName,
          disabled && "pointer-events-none text-navigation-link-disabled",
          isActive && activeLinkClassName
        )
      }
    >
      {item.label}
    </NavLink>
  );
}
