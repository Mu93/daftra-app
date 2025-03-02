"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { NavItemProps, DragItem } from "./_utils/navigationTypes";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Save,
} from "lucide-react";

export const NavItem: React.FC<NavItemProps> = ({
  item,
  index,
  moveItem,
  onToggleVisibility,
  isEditMode,
  expandedItems,
  onToggleExpand,
  isEditing,
  onStartEditing,
  onUpdateTitle,
}) => {
  const [editTitle, setEditTitle] = useState(item.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const dragRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "NAV_ITEM",
    item: {
      id: item.id,
      index,
      level: item.level,
      parentId: item.parentId,
      isParent: item.isParent,
    } as DragItem,
    // Allow dragging for all items in edit mode
    canDrag: () => isEditMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "NAV_ITEM",
    canDrop: (draggedItem: DragItem) => {
      if (draggedItem.id === item.id) return false; // Prevent dropping on itself

      // Allow dropping only among items of the same level AND with the same parent
      return (
        draggedItem.level === item.level &&
        draggedItem.parentId === item.parentId
      );
    },
    hover: (draggedItem: DragItem, monitor) => {
      if (!monitor.canDrop()) return;
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const itemRef = useRef(null);
  drag(drop(itemRef));
  drag(dragRef);

  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.isParent;
  const shouldShow =
    !item.parentId || (item.parentId && expandedItems.includes(item.parentId));

  const handleSaveTitle = () => {
    if (onUpdateTitle) {
      onUpdateTitle(item.id, editTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setEditTitle(item.title);
      if (onUpdateTitle) {
        onUpdateTitle(item.id, item.title);
      }
    }
  };

  const handleStartEditing = () => {
    if (item.visible && onStartEditing) {
      onStartEditing(item.id);
    }
  };

  if (!shouldShow) return null;
  if (!isEditMode && !item.visible) return null;

  return (
    <div
      ref={
        isEditMode
          ? (node: HTMLDivElement | null) => {
              if (node) {
                drag(drop(node));
              }
            }
          : null
      }
      className={`
    ${!shouldShow ? "hidden" : ""}
    ${isDragging ? "opacity-50" : ""}
    ${item.level > 0 ? "ml-6 my-1 " : ""}
    ${isEditMode ? "bg-gray-100 hover:bg-salate-200" : "hover:bg-gray-50"}
    ${!item.visible ? "opacity-40" : ""}
    ${isOver && canDrop ? "border-2 border-blue-400" : ""}
    rounded-lg
  `}
    >
      <div className="flex items-center p-3 mt-1">
        <div className="flex items-center flex-1 gap-2">
          {isEditMode && (
            <div ref={dragRef} className="cursor-move">
              <GripVertical className="text-gray-400" size={16} />
            </div>
          )}

          <div className={`flex-1 ${!item.visible ? "text-gray-400" : ""}`}>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-blue-500 hover:text-blue-700"
                >
                  <Save size={16} />
                </button>
              </div>
            ) : (
              item.title
            )}
          </div>

          {hasChildren && (
            <button
              onClick={() => onToggleExpand(item.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {isEditMode && (
            <>
              {!isEditing && (
                <button
                  onClick={handleStartEditing}
                  className={`text-gray-500 hover:text-gray-700 ${
                    !item.visible ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!item.visible}
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                onClick={() => onToggleVisibility(item.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {!item.visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
