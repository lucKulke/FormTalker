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

interface AddNewFormFieldDialogProps {
  children: ReactNode;
  availableIds: string[];
  fieldsetId: string;
  onSave: (
    fieldsetId: string,
    formFieldDescription: string,
    formFieldId: string
  ) => void;
}

export const AddNewFormFieldDialog: React.FC<AddNewFormFieldDialogProps> = ({
  children,
  availableIds,
  fieldsetId,
  onSave,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const handleSave = () => {
    const isNumeric = (string: string) => /^[+-]?\d+(\.\d+)?$/.test(string);
    if (isNumeric(formFieldId)) {
      if (formFieldDescription.length < 2) {
        setErrorMessage(`Error! Field description to short..`);
      } else {
        onSave(fieldsetId, formFieldDescription, formFieldId);
        setFormFieldId("nothing selected");
        setOpenDialog(false);
      }
      // Call the onSave function passed as a prop with the input value
    } else {
      setErrorMessage(`Error! No ID was selected..`);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }, [errorMessage]);

  const [formFieldDescription, setFormFieldDescription] = useState<string>("");
  const [formFieldId, setFormFieldId] = useState<string>("Select ID");

  const handleSelectChange = (id: string) => {
    setFormFieldId(id);
  };
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new form field</DialogTitle>
          <DialogDescription>
            Create a new form field and save it.
          </DialogDescription>
        </DialogHeader>
        <div className="h-3 flex justify-center ">
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>

        <div>
          <ul className="space-y-3 mb-2">
            <li>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </li>
            <li>
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Input
                id="name"
                placeholder="e.g. in ordnung"
                className="col-span-3"
                value={formFieldDescription}
                onChange={(e) => setFormFieldDescription(e.target.value)}
              />
            </li>
          </ul>
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
