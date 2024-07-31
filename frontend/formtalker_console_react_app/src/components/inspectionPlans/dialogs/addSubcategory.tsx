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

interface AddCategoryDialogProps {
  onSave: (name: string) => void;
  openDialog: boolean;
  setOpenChange: React.Dispatch<React.SetStateAction<any>>;
}

export const AddSubcategoryDialog: React.FC<AddCategoryDialogProps> = ({
  onSave,
  openDialog,
  setOpenChange,
}) => {
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const handleSave = () => {
    onSave(subcategoryName); // Call the onSave function passed as a prop with the input value
    setSuccessMessage(`successfully saved ${subcategoryName}`);
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
          <DialogTitle>Create new Subcategory</DialogTitle>
          <DialogDescription>
            Create a new Subcategory and save it.
          </DialogDescription>
        </DialogHeader>
        <div className="h-3 flex justify-center ">
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Elektrik"
              className="col-span-3"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
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
