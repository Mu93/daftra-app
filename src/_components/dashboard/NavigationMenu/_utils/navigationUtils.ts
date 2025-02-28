import { NavItem, FlatNavItem } from "./navigationTypes";

export const API_URL = "http://localhost:8081";

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
      visible: item.visible ?? true, // Default to true if not provided
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
  const itemMap = new Map<number, NavItem>();

  // First pass: Create all NavItem objects and store them in the map
  items.forEach((item) => {
    itemMap.set(item.id, {
      id: item.id,
      title: item.title,
      target: item.target,
      visible: item.visible,
      children: [],
    });
  });

  // Second pass: Build the tree structure by adding children to parents
  const rootItems: NavItem[] = [];

  items.forEach((item) => {
    const navItem = itemMap.get(item.id);

    if (!navItem) return;

    if (item.parentId === null || item.parentId === undefined) {
      // This is a root item
      rootItems.push(navItem);
    } else {
      // This is a child item, add it to its parent
      const parent = itemMap.get(item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(navItem);
      } else {
        // If parent doesn't exist, treat it as a root item
        console.warn(
          `Parent with ID ${item.parentId} not found for item ${item.id}, adding to root`
        );
        rootItems.push(navItem);
      }
    }
  });

  return rootItems;
};

export const validateTreeStructure = (
  flatItems: FlatNavItem[],
  tree: NavItem[]
): boolean => {
  const flatTree = flattenNav(tree);
  return flatTree.length === flatItems.length;
};

export const trackMove = async (
  id: number,
  from: number,
  to: number,
  retries: number = 3
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

    if (retries > 0) {
      console.log(`Retrying... Attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      return trackMove(id, from, to, retries - 1);
    }

    throw error; // Re-throw the error if all retries fail
  }
};
