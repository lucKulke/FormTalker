import React, { useState, ReactNode } from "react";
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
import { AddCategoryDialog } from "./dialogs/addCategoryDialog";

import { MainCategoryInterface, SubCategoryInterface } from "./interfaces";
import {
  SubCategoryInSidebar,
  CategoryInSidebar,
} from "./sideBarComponents/categorys";
import { IoAddCircle } from "react-icons/io5";
interface SidebarProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onDeleteSubcategory: (id: string) => void;
  onAddSubcategory: (category_id: string, name: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categorys,
  subcategorys,
  onAddCategory,
  onDeleteCategory,
  onDeleteSubcategory,
  onAddSubcategory,
}) => {
  return (
    <div className="h-full bg-gray-100 w-1/4 min:1/4 p-4 overflow-y-auto">
      <div className="mb-2">
        <button>Head data:</button>
      </div>
      <div className="mb-2 flex">
        <h3 className="mr-2">Categorys</h3>
        <AddCategoryDialog onSave={onAddCategory}>
          <button>
            <IoAddCircle className="h-7 w-7 text-gray-400 hover:text-black" />
          </button>
        </AddCategoryDialog>
      </div>
      <div className="ml-3">
        {categorys?.map((category) => (
          <div key={category.id}>
            <CategoryInSidebar
              id={category.id}
              onDelete={onDeleteCategory}
              onAddSubcategory={onAddSubcategory}
            >
              {category.name}
            </CategoryInSidebar>
            {subcategorys?.map((subcategory) => (
              <div key={subcategory.id}>
                {subcategory.category_id === category.id && (
                  <SubCategoryInSidebar
                    key={subcategory.id}
                    id={subcategory.id}
                    category_id={subcategory.category_id}
                    onDelete={onDeleteSubcategory}
                  >
                    {subcategory.name}
                  </SubCategoryInSidebar>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
