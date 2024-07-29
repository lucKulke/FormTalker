import React, { useState } from "react";
import { Category } from "./interfaces";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  categories: [];
  onSelectCategory: (categoryIndex: number) => void;
  onAddCategory: () => void;
  onDeleteCategory: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
}) => (
  <div className="fixed h-full w-64 bg-gray-100 p-4 overflow-y-auto">
    <div className="mb-2">
      <button>Head data:</button>
    </div>
    <div>
      <button>Categorys:</button>
    </div>
    {categories.map((category, index) => (
      <React.Fragment key={index}>
        <div className="flex">
          <div
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectCategory(index)}
          >
            {category}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(index);
                }}
                className=" text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {index < categories.length - 1 && <hr className="border-gray-300" />}
      </React.Fragment>
    ))}
    <button
      onClick={onAddCategory}
      className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Add Category
    </button>
  </div>
);
