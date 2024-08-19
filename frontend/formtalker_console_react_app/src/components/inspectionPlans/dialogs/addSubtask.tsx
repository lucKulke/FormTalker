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

interface AddSubtaskDialogProps {
  children: ReactNode;
  fieldsetId: string;
  onSave: (fieldsetId: string, taskDescription: string) => void;
}

export const AddSubtaskDialog: React.FC<AddSubtaskDialogProps> = ({
  children,
  fieldsetId,
  onSave,
}) => {
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const handleSave = () => {
    if (taskDescription.length <= 2) {
      setErrorMessage("Error! Task description to short..");
    } else {
      onSave(fieldsetId, taskDescription); // Call the onSave function passed as a prop with the input value
      setSuccessMessage(`successfully added '${taskDescription}'`);
    }
  };
  useEffect(() => {
    if (successMessage) {
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }, [errorMessage]);

  const [taskDescription, setTaskDescription] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Subtask</DialogTitle>
          <DialogDescription>Create a subtask and save it.</DialogDescription>
        </DialogHeader>
        <div className="h-3 flex justify-center ">
          {successMessage && <p className="text-green-600">{successMessage}</p>}
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskdescription" className="text-right">
              Task
            </Label>
            <Input
              id="taskdescription"
              placeholder="e.g. Fernlicht prüfen"
              className="col-span-3"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};