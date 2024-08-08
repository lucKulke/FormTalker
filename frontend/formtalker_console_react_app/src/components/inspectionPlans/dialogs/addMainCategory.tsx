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

interface AddMainCategoryDialogProps {
  children: ReactNode;
  onSave: (name: string) => void;
}

export const AddMainCategoryDialog: React.FC<AddMainCategoryDialogProps> = ({
  children,
  onSave,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const handleSave = () => {
    onSave(categoryName); // Call the onSave function passed as a prop with the input value
    setSuccessMessage(`successfully saved '${categoryName}'`);
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [successMessage]);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
          <DialogDescription>
            Create a new category and save it.
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
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
