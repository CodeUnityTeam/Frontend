import { NavLink } from "react-router";
import type { NavigationItem } from "./navigation-types";

interface Props {
  item: NavigationItem;
  linkClassName?: string;
  activeLinkClassName?: string;
}

export function NavigationItemComponent({
  item,
  linkClassName = "",
  activeLinkClassName = "",
}: Props) {
  return (
    <NavLink
      to={item.to}
      aria-label={`Перейти на страницу ${item.label}`}
      className={({ isActive }) => 
        `
        ${linkClassName}
        ${isActive ? activeLinkClassName : ""}
        `
      }
    >
      {item.label}
    </NavLink>
  );
}
