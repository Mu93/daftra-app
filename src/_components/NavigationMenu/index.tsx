"use client";
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Settings, X, Check } from "lucide-react";
import { NavItem } from "./NavItem";
import { flattenNav, buildNavTree, API_URL, trackMove } from "./utils";
import type { FlatNavItem, NavItem as NavItemType } from "./types";

export const NavigationMenu: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState<FlatNavItem[]>([]);
  const [originalItems, setOriginalItems] = useState<FlatNavItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const response = await fetch(`${API_URL}/nav`);
      if (!response.ok) throw new Error("Failed to fetch nav items");
      const data = (await response.json()) as NavItemType[];
      const flatItems = flattenNav(data);
      setItems(flatItems);
      setOriginalItems(flatItems);
    } catch (error) {
      console.error("Error fetching nav items:", error);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
    trackMove(movedItem.id, fromIndex, toIndex);
  };

  const toggleVisibility = (itemId: number) => {
    if (!isEditMode) return;
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const toggleExpand = (itemId: number) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
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
    } catch (error) {
      console.error("Error saving nav items:", error);
    }
  };

  const handleCancel = () => {
    setItems(originalItems);
    setIsEditMode(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white shadow-lg rounded-lg h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          {isEditMode ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="p-1 text-red-500 rounded-full hover:bg-red-50"
              >
                <X size={20} />
              </button>
              <button
                onClick={handleSave}
                className="p-1 text-green-500 rounded-full hover:bg-green-50"
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
            >
              <Settings size={20} />
            </button>
          )}
        </div>

        <div className="p-2">
          {items.map((item, index) => (
            <NavItem
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              onToggleVisibility={toggleVisibility}
              isEditMode={isEditMode}
              expandedItems={expandedItems}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
