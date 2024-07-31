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

interface SubCategoryProps {
  children: ReactNode;
  id: string;
  category_id: string;
  onDelete: (id: string) => void;
}
interface CategoryProps {
  children: ReactNode;
  id: string;
  onDelete: (id: string) => void;
  onAddSubcategory: (category_id: string, name: string) => void;
}

export const SubCategoryInSidebar: React.FC<SubCategoryProps> = ({
  children,
  id,
  onDelete,
}) => {
  return (
    <div //to make the distance between subcategorys greater tune py
      className="relative ml-6 py-2 border-l-2  border-gray-300 font-mono"
    >
      <div className="absolute left-[-0.08rem] top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
      <div className="flex group">
        <h2 className="ml-3 mr-2">{children}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="text-gray-300 hover:text-black hidden group-hover:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
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
    </div>
  );
};

export const CategoryInSidebar: React.FC<CategoryProps> = ({
  id,
  children,
  onDelete,
  onAddSubcategory,
}) => {
  const handleAddSubcategory = (name: string) => {
    onAddSubcategory(id, name);
  };

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <div className="flex group">
      <div className="text-lg font-mono mr-2" key={id}>
        {children}
      </div>
      <AddSubcategoryDialog
        onSave={handleAddSubcategory}
        openDialog={openDialog}
        setOpenChange={setOpenDialog}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="text-gray-300 hover:text-black hidden group-hover:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            add subcategory
          </DropdownMenuItem>

          <DropdownMenuItem>Edit</DropdownMenuItem>
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
