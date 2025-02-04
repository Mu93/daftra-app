export interface NavItem {
  id: number;
  title: string;
  target?: string;
  visible?: boolean;
  children?: NavItem[];
}

export interface FlatNavItem extends Omit<NavItem, "children"> {
  level: number;
  parentId: number | null;
  isParent: boolean;
}

export interface DragItem {
  id: number;
  index: number;
  level: number;
  parentId: number | null;
}

export interface NavItemProps {
  item: FlatNavItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (id: number) => void;
  isEditMode: boolean;
  expandedItems: number[];
  onToggleExpand: (id: number) => void;
}
