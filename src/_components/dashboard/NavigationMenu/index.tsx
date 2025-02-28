"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NavItem } from "./NavItem";
import { Check, Settings, X } from "lucide-react";
import { NavigationProvider, useNavigation } from "./_utils/NavigationContext";

// Main component wrapper that provides the context
export const NavigationMenu: React.FC = () => {
  return (
    <NavigationProvider>
      <DndProvider backend={HTML5Backend}>
        <NavigationMenuContent />
      </DndProvider>
    </NavigationProvider>
  );
};

// Inner component that consumes the context
const NavigationMenuContent: React.FC = () => {
  const {
    isEditMode,
    setIsEditMode,
    items,
    expandedItems,
    editingItemId,
    moveItem,
    toggleVisibility,
    toggleExpand,
    startEditing,
    updateTitle,
    handleSave,
    handleCancel,
  } = useNavigation();

  return (
    <div className="bg-white shadow-lg rounded-lg h-full min-w-[18rem]">
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
            isEditing={editingItemId === item.id}
            onStartEditing={startEditing}
            onUpdateTitle={updateTitle}
          />
        ))}
      </div>
    </div>
  );
};
