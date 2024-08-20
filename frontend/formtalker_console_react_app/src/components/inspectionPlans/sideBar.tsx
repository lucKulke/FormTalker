import React from "react";

import { AddMainCategoryDialog } from "./dialogs/addMainCategory";

import { MainCategoryInterface, SubCategoryInterface } from "./interfaces";
import { MainCategoryInSidebar } from "@/components/inspectionPlans/sideBarComponents/mainCategorys";
import { SubCategoryInSidebar } from "./sideBarComponents/subCategorys";
import { IoAddCircle } from "react-icons/io5";
import { HeadData } from "./inspectionPlanConfigComponents/headData";
interface SidebarProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onDeleteSubcategory: (id: string) => void;
  onAddSubcategory: (category_id: string, name: string) => void;
  onEditCategoryName: (category_id: string, newName: string) => void;
  onEditSubCategoryName: (category_id: string, newName: string) => void;
  scrollToSection: (id: string) => void; // Add this prop
}

export const Sidebar: React.FC<SidebarProps> = ({
  categorys,
  subcategorys,
  onAddCategory,
  onDeleteCategory,
  onDeleteSubcategory,
  onAddSubcategory,
  onEditCategoryName,
  onEditSubCategoryName,
  scrollToSection, // Destructure this prop
}) => {
  return (
    <div className="h-full w-1/4 shadow-xl border-2 rounded-xl p-4 border-black overflow-y-auto">
      <div className="mb-5 font-mono">
        <h3>HeadData</h3>
        <HeadData></HeadData>
      </div>
      <div className="mb-2 flex">
        <h3 className="mr-2 font-mono">Categorys</h3>
        <AddMainCategoryDialog onSave={onAddCategory}>
          <button>
            <IoAddCircle className="h-7 w-7 text-gray-400 hover:text-black" />
          </button>
        </AddMainCategoryDialog>
      </div>
      <div className="ml-3">
        {categorys?.map((category) => (
          <div key={category.id} onClick={() => scrollToSection(category.id)}>
            <MainCategoryInSidebar
              id={category.id}
              onDelete={onDeleteCategory}
              onAddSubcategory={onAddSubcategory}
              onEditCategoryName={onEditCategoryName}
            >
              {category.name}
            </MainCategoryInSidebar>
            {subcategorys?.map((subcategory) => (
              <div
                key={subcategory.id}
                onClick={() => scrollToSection(subcategory.id)}
              >
                {subcategory.category_id === category.id && (
                  <SubCategoryInSidebar
                    key={subcategory.id}
                    id={subcategory.id}
                    category_id={subcategory.category_id}
                    onDelete={onDeleteSubcategory}
                    onEditSubCategoryName={onEditSubCategoryName}
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
