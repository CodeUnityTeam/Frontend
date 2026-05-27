import { NavigationItem } from "./navigation-item";
import type { NavigationProps } from "./navigation-types";

export function Navigation({
  items,
  className = "",
  listClassName = "",
  itemClassName = "",

  linkClassName = `
    text-navigation-link
    transition-colors duration-200
    hover:text-navigation-link-hover
    active:text-navigation-link-pressed
    focus-visible:text-navigation-link-focused
    focus-visible:outline-none
    disabled:text-navigation-link-disabled
  `,
  activeLinkClassName = "text-navigation-link-active",
}: NavigationProps) {
  return (
    <nav className={className}>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.id} className={itemClassName}>
            <NavigationItem
              item={item}
              linkClassName={linkClassName}
              activeLinkClassName={activeLinkClassName}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
