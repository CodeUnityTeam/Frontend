export interface NavigationItem {
  label: string;
  to: string;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
}
