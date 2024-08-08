import { ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AddSubcategoryDialog } from "../dialogs/addSubcategory";
import { EditCategoryDialog } from "../dialogs/editCategory";

interface MainCategoryProps {
  children: ReactNode;
  id: string;
  onDelete: (id: string) => void;
  onAddSubcategory: (category_id: string, name: string) => void;
  onEditCategoryName: (category_id: string, newName: string) => void;
}

export const MainCategoryInSidebar: React.FC<MainCategoryProps> = ({
  id,
  children,
  onDelete,
  onAddSubcategory,
  onEditCategoryName,
}) => {
  const handleAddSubcategory = (name: string) => {
    onAddSubcategory(id, name);
  };

  const handleEditCategory = (newName: string) => {
    onEditCategoryName(id, newName);
  };

  const [openAddSubcategoryDialog, setOpenAddSubcategoryDialog] =
    useState<boolean>(false);
  const [openEditCategoryDialog, setOpenEditCategoryDialog] =
    useState<boolean>(false);
  return (
    <div className="flex group">
      <div className="text-lg font-mono mr-2" key={id}>
        {children}
      </div>
      <AddSubcategoryDialog
        onSave={handleAddSubcategory}
        openDialog={openAddSubcategoryDialog}
        setOpenChange={setOpenAddSubcategoryDialog}
      />
      {children && (
        <EditCategoryDialog
          prevName={children.toString()}
          onSave={handleEditCategory}
          openDialog={openEditCategoryDialog}
          setOpenChange={setOpenEditCategoryDialog}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="text-gray-300 hover:text-black hidden group-hover:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setOpenAddSubcategoryDialog(true);
            }}
          >
            add subcategory
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpenEditCategoryDialog(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => {
              onDelete(id);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
