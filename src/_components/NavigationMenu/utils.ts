import { NavItem, FlatNavItem } from "./types";

export const flattenNav = (
  items: NavItem[],
  parentId: number | null = null,
  level: number = 0
): FlatNavItem[] => {
  return items.reduce<FlatNavItem[]>((flat, item) => {
    const flatItem: FlatNavItem = {
      id: item.id,
      title: item.title,
      target: item.target,
      visible: item.visible !== false,
      level,
      parentId,
      isParent: Boolean(item.children?.length),
    };

    return item.children
      ? [...flat, flatItem, ...flattenNav(item.children, item.id, level + 1)]
      : [...flat, flatItem];
  }, []);
};

export const buildNavTree = (items: FlatNavItem[]): NavItem[] => {
  return items
    .filter((item) => item.level === 0)
    .map((item) => ({
      ...item,
      children: items
        .filter((child) => child.parentId === item.id)
        .map((child) => ({ ...child })),
    }));
};

export const API_URL = "http://localhost:8081";

export const trackMove = async (
  id: number,
  from: number,
  to: number
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, from, to }),
    });
    if (!response.ok) {
      throw new Error("Failed to track move");
    }
  } catch (error) {
    console.error("Error tracking move:", error);
    throw error;
  }
};
