import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditCategoryDialogProps {
  openDialog: boolean;
  prevName: string;
  setOpenChange: React.Dispatch<React.SetStateAction<any>>;
  onSave: (name: string) => void;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  setOpenChange,
  openDialog,
  prevName,
  onSave,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const handleSave = () => {
    onSave(categoryName); // Call the onSave function passed as a prop with the input value
    setSuccessMessage(`successfully edited and saved ${categoryName}`);
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [successMessage]);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit category name</DialogTitle>
          <DialogDescription>
            Edit the category name. Previous name was: '{prevName}'
          </DialogDescription>
        </DialogHeader>
        <div className="h-3 flex justify-center ">
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Elektrik"
              className="col-span-3"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
