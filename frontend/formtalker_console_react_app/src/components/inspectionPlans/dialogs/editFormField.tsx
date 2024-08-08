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
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditFormFieldProps {
  children: ReactNode;
  prevFormFieldDescription: string;
  formFieldId: string;
  fieldsetId: string;
  onSave: (formFieldId: string, newFormFieldDescription: string) => void;
  onDelete: (formFieldId: string, fieldsetId: string) => void;
}

export const EditFormField: React.FC<EditFormFieldProps> = ({
  children,
  formFieldId,
  prevFormFieldDescription,
  fieldsetId,
  onSave,
  onDelete,
}) => {
  const handleSave = () => {
    setOpenDialog(false);
    onSave(formFieldId, formFieldDescription); // Call the onSave function passed as a prop with the input value
  };

  const handleDelete = () => {
    setOpenDialog(false);
    onDelete(formFieldId, fieldsetId); // Call the onSave function passed as a prop with the input value
  };

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [formFieldDescription, setFormFieldDescription] = useState<string>(
    prevFormFieldDescription
  );

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit existing formfield</DialogTitle>
          <DialogDescription>
            Edit existing formfield and save it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 mr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-xl">
              {formFieldId}
            </Label>
            <Input
              id="description"
              placeholder={prevFormFieldDescription}
              className="col-span-3"
              value={formFieldDescription}
              onChange={(e) => setFormFieldDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleDelete}>
            Delete Field
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
