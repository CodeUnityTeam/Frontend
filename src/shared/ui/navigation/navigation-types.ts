export interface NavigationItem {
  id: string;
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
  onItemClick?: () => void;
}
