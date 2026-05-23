import { NavigationItemComponent } from "./navigation-item";
import type { NavigationProps } from "./navigation-types";

export function Navigation({
  items,
  className = "",
  listClassName = "",
  itemClassName = "",

  linkClassName = "",
  activeLinkClassName = "",
}: NavigationProps) {
  return (
    <nav className={className}>
      <ul className={listClassName}>
        {items.map((item) => (
          <li key={item.to} className={itemClassName}>
            <NavigationItemComponent
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
