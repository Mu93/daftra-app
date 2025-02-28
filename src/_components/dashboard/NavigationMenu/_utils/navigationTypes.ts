// NavigationMenuTypes.ts updates
export interface NavItem {
  id: number;
  title: string;
  target?: string;
  visible?: boolean;
  children?: NavItem[];
}

export interface FlatNavItem {
  id: number;
  title: string;
  target?: string;
  visible: boolean;
  level: number;
  parentId: number | null;
  isParent: boolean;
}

export interface DragItem {
  id: number;
  index: number;
  level: number;
  parentId: number | null;
  isParent: boolean;
}

export interface NavItemProps {
  item: FlatNavItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (itemId: number) => void;
  isEditMode: boolean;
  expandedItems: number[];
  onToggleExpand: (itemId: number) => void;
  isEditing?: boolean;
  onStartEditing?: (itemId: number) => void;
  onUpdateTitle?: (itemId: number, newTitle: string) => void;
}
