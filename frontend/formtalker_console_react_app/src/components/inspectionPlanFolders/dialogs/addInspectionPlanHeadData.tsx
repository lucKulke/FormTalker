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

interface AddInspectionPlanHeadDataDialogProps {
  children: ReactNode;
  onSave: (
    inspectionType: string,
    description: string,
    millage: number | null
  ) => void;
}

export const AddInspectionPlanHeadDataDialog: React.FC<
  AddInspectionPlanHeadDataDialogProps
> = ({ children, onSave }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [inspectionsType, setInspectionsType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [millage, setMillage] = useState<string>("");
  const [millageError, setMillageError] = useState<boolean>(false);
  const availableInspectionTypes = ["Millage Inspection", "test2"];

  const handleSelectChange = (inspectionType: string) => {
    setInspectionsType(inspectionType);
  };

  const handleCreate = () => {
    if (inspectionsType === "Millage Inspection" && millage.length === 0) {
      setMillageError(true);
    } else {
      const convertedMillage = millage.length === 0 ? null : Number(millage);
      onSave(inspectionsType, description, convertedMillage);
      setInspectionsType("");
      setDescription("");
      setMillage("");
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    if (millageError) {
      setTimeout(() => {
        setMillageError(false);
      }, 5000);
    }
  }, [millageError]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Inspection Plan</DialogTitle>
          <DialogDescription>
            Create a new Inspection Plan and save it.
          </DialogDescription>
        </DialogHeader>

        <div>
          <ul className="space-y-3 mb-2">
            <li className="flex justify-between">
              <div>
                <Label htmlFor="inspectiontype" className="mr-2">
                  Inspection Type
                </Label>
                <div id="inspectiontype">
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availableInspectionTypes.map((id) => (
                          <SelectItem key={id} value={id}>
                            {id}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {inspectionsType === "Millage Inspection" && (
                <div>
                  <Label htmlFor="millage" className="text-right">
                    Millage
                  </Label>
                  <Input
                    id="millage"
                    placeholder="e.g. 10000"
                    className={`col-span-3 ${millageError && "bg-red-300"}`}
                    value={millage}
                    onChange={(e) => setMillage(e.target.value)}
                  />
                </div>
              )}
            </li>

            <li>
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Input
                id="name"
                placeholder="e.g. in ordnung"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => handleCreate()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
