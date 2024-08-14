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

interface AddInspectionPlanDialogProps {
  children: ReactNode;
}

export const AddInspectionPlanDialog: React.FC<
  AddInspectionPlanDialogProps
> = ({ children }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [inspectionsType, setInspectionsType] = useState<string>("");
  const [formFieldDescription, setFormFieldDescription] = useState();
  const availableInspectionTypes = ["Millage Inspection", "test2"];

  const handleSelectChange = (id: string) => {
    setInspectionsType(id);
  };

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
                    className="col-span-3"
                    value={formFieldDescription}
                    onChange={(e) => setFormFieldDescription(e.target.value)}
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
                value={formFieldDescription}
                onChange={(e) => setFormFieldDescription(e.target.value)}
              />
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => {}}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
