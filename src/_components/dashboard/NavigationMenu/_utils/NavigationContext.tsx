"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import type { FlatNavItem, NavItem as NavItemType } from "./navigationTypes";
import {
  flattenNav,
  buildNavTree,
  API_URL,
  trackMove,
} from "./navigationUtils";

// Define the context type
type NavigationContextType = {
  items: FlatNavItem[];
  originalItems: FlatNavItem[];
  expandedItems: number[];
  editingItemId: number | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  setItems: (items: FlatNavItem[]) => void;
  setOriginalItems: (items: FlatNavItem[]) => void;
  setExpandedItems: (items: number[]) => void;
  setEditingItemId: (id: number | null) => void;
  fetchNavItems: () => Promise<void>;
  moveItem: (fromIndex: number, toIndex: number) => void;
  toggleVisibility: (itemId: number) => void;
  toggleExpand: (itemId: number) => void;
  startEditing: (itemId: number) => void;
  updateTitle: (itemId: number, newTitle: string) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  getAncestorIds: (item: FlatNavItem) => number[];
  getDescendantIds: (itemId: number) => number[];
};

// Create the context with a default value
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState<FlatNavItem[]>([]);
  const [originalItems, setOriginalItems] = useState<FlatNavItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [, setIsSaving] = useState(false);

  // Prevent unnecessary fetching
  useEffect(() => {
    if (items.length === 0) {
      fetchNavItems();
    }
  }, []);

  const fetchNavItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/nav`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = (await response.json()) as NavItemType[];
      const flatItems = flattenNav(data);
      setItems(flatItems);
      setOriginalItems(flatItems);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch navigation"
      );
      console.error("Error fetching nav items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const movedItem = newItems[fromIndex];
    const targetItem = newItems[toIndex];

    // Ensure we're only moving within the same level
    if (movedItem.level !== targetItem.level) {
      return; // Don't allow the move if levels aren't the same
    }

    // Collect all the children (and their children) of the moved item
    const allDescendantIds = getDescendantIds(movedItem.id);
    const childrenItems = allDescendantIds
      .map((id) => newItems.find((item) => item.id === id))
      .filter(Boolean) as FlatNavItem[];

    // Collect all the indices to be moved (parent + all descendants)
    const movedItemIndices = [
      fromIndex,
      ...childrenItems.map((child) =>
        newItems.findIndex((item) => item.id === child.id)
      ),
    ].sort((a, b) => a - b);

    // Create a copy of the items that will be moved
    const movedItems = movedItemIndices.map((index) => newItems[index]);

    // Calculate target index adjustment
    // If moving down the list, the target index needs to be adjusted
    // because removing items above will shift the target position
    let adjustedToIndex = toIndex;
    const movingDown = fromIndex < toIndex;

    // Remove all items that need to be moved (in reverse order to maintain indices)
    movedItemIndices
      .slice()
      .reverse()
      .forEach((index) => {
        newItems.splice(index, 1);
        // Adjust the target index when moving items from above the target
        if (movingDown && index < adjustedToIndex) {
          adjustedToIndex--;
        }
      });

    // Insert the moved items at the adjusted position
    newItems.splice(adjustedToIndex, 0, ...movedItems);

    setItems(newItems);
    trackMove(movedItem.id, fromIndex, adjustedToIndex);
  };
  // Get all ancestor IDs for a given item
  const getAncestorIds = (item: FlatNavItem): number[] => {
    const ancestors: number[] = [];
    let currentParentId = item.parentId;

    while (currentParentId !== null) {
      ancestors.push(currentParentId);
      const parentItem = items.find((item) => item.id === currentParentId);
      if (!parentItem) break;
      currentParentId = parentItem.parentId;
    }

    return ancestors;
  };

  // Get all descendant IDs for a given item
  // Memoize expensive functions
  const getDescendantIds = useCallback(
    (itemId: number): number[] => {
      const directChildren = items.filter((item) => item.parentId === itemId);
      const descendants = directChildren.map((child) => child.id);

      // Recursively add descendants of children
      directChildren.forEach((child) => {
        descendants.push(...getDescendantIds(child.id));
      });

      return descendants;
    },
    [items]
  );

  const toggleVisibility = (itemId: number) => {
    if (!isEditMode) return;

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemToToggle = updatedItems.find((item) => item.id === itemId);
      if (!itemToToggle) return prevItems;

      const newVisibility = !itemToToggle.visible;
      const ancestorIds = getAncestorIds(itemToToggle);
      const descendantIds = getDescendantIds(itemId);

      return updatedItems.map((item) => {
        // Making visible: update this item and all ancestors
        if (
          newVisibility &&
          (item.id === itemId || ancestorIds.includes(item.id))
        ) {
          return { ...item, visible: true };
        }
        // Making invisible: update this item and all descendants
        else if (
          !newVisibility &&
          (item.id === itemId || descendantIds.includes(item.id))
        ) {
          if (editingItemId === item.id) {
            setEditingItemId(null);
          }
          return { ...item, visible: false };
        }
        return item;
      });
    });
  };

  // Wrap handlers in useCallback
  const toggleExpand = useCallback((itemId: number) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const startEditing = (itemId: number) => {
    if (!isEditMode) return;

    // Find the item
    const itemToEdit = items.find((item) => item.id === itemId);

    // Only allow editing if the item is visible
    if (itemToEdit && itemToEdit.visible) {
      setEditingItemId(itemId);
    }
  };

  const updateTitle = (itemId: number, newTitle: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, title: newTitle } : item
      )
    );
    setEditingItemId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const treeData = buildNavTree(items);
      const response = await fetch(`${API_URL}/nav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(treeData),
      });
      if (!response.ok) throw new Error("Failed to save nav items");
      setOriginalItems(items);
      setIsEditMode(false);
      setEditingItemId(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save navigation"
      );
      console.error("Error saving nav items:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setItems(originalItems);
    setIsEditMode(false);
    setEditingItemId(null);
  };

  // Create the context value object
  const contextValue: NavigationContextType = {
    items,
    originalItems,
    expandedItems,
    editingItemId,
    isEditMode,
    setIsEditMode,
    setItems,
    setOriginalItems,
    setExpandedItems,
    setEditingItemId,
    fetchNavItems,
    moveItem,
    toggleVisibility,
    toggleExpand,
    startEditing,
    updateTitle,
    handleSave,
    handleCancel,
    getAncestorIds,
    getDescendantIds,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
