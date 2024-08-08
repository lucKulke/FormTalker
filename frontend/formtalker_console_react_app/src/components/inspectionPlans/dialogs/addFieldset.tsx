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

interface AddFieldsetDialogProps {
  children: ReactNode;
  addableFieldsetTypes: string[];
  onSave: (typesToAdd: string[], subcategoryId: string) => void;
  subcategoryId: string;
}

export const AddFieldsetDialog: React.FC<AddFieldsetDialogProps> = ({
  children,
  onSave,
  addableFieldsetTypes,
  subcategoryId,
}) => {
  const [fieldsetType, setFieldsetType] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");

  const handleSave = () => {
    let fieldsetTypesToAdd: string[] = [];
    addableFieldsetTypes.forEach((fieldsetTypeName) => {
      if (checkedState[fieldsetTypeName]) {
        fieldsetTypesToAdd.push(fieldsetTypeName);
      }
    });

    onSave(fieldsetTypesToAdd, subcategoryId); // Call the onSave function passed as a prop with the input value
    setSuccessMessage(`successfully added '${fieldsetTypesToAdd}'`);
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [successMessage]);

  // Initialize state with an object where keys are the checkbox labels and values are booleans
  const [checkedState, setCheckedState] = useState(
    addableFieldsetTypes.reduce((acc, label) => {
      acc[label] = false;
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Step 3: Add onChange event handler

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new fieldset</DialogTitle>
          <DialogDescription>
            Create a new fieldset and save it.
          </DialogDescription>
        </DialogHeader>
        <div className="h-3 flex justify-center ">
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </div>

        <ul className="space-y-2 mb-3">
          {addableFieldsetTypes?.map((label) => (
            <li key={label} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={label}
                name={label}
                checked={checkedState[label]}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <label
                htmlFor={label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
