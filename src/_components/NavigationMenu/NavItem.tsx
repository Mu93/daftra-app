"use client";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

import type { NavItemProps, DragItem } from "./types";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";

export const NavItem: React.FC<NavItemProps> = ({
  item,
  index,
  moveItem,
  onToggleVisibility,
  isEditMode,
  expandedItems,
  onToggleExpand,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "NAV_ITEM",
    item: {
      id: item.id,
      index,
      level: item.level,
      parentId: item.parentId,
    } as DragItem,
    canDrag: () => isEditMode && !item.isParent && item.level > 0,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "NAV_ITEM",
    canDrop: (draggedItem: DragItem) => {
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
  });

  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.isParent;
  const shouldShow =
    !item.parentId || (item.parentId && expandedItems.includes(item.parentId));

  if (!shouldShow) return null;
  if (!isEditMode && !item.visible) return null;

  return (
    <div
      ref={
        item.level > 0 && !item.isParent
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
    ${isEditMode && !item.isParent && item.level > 0 ? "cursor-move" : ""}
    rounded-lg
  `}
    >
      <div className="flex items-center p-3 mt-1">
        <div className="flex items-center flex-1 gap-2">
          {isEditMode && !item.isParent && item.level > 0 && (
            <GripVertical className="text-gray-400" size={16} />
          )}

          <div className={`flex-1 ${!item.visible ? "text-gray-400" : ""}`}>
            {item.title}
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
              <Edit size={16} className="text-gray-500" />
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
