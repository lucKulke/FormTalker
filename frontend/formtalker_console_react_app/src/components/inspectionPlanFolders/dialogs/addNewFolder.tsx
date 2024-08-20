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
import { isOnlyDigits } from "@/utils/helperFunctions";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddNewFolderDialogProps {
  children: ReactNode;
  onSave: (model: string, brand: string, hsn: string, tsn: string) => void;
}

export const AddNewFolderDialog: React.FC<AddNewFolderDialogProps> = ({
  children,
  onSave,
}) => {
  const [model, setModel] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [hsn, setHsn] = useState<string>("");
  const [tsn, setTsn] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>();

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>
            Create a new folder and save it.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-2">
          <ul className="space-y-3 mb-2 w-3/4">
            <li>
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                placeholder="e.g. RS7"
                className={`col-span-3`}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </li>
            <li>
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input
                id="brand"
                placeholder="e.g. Audi"
                className={`col-span-3`}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </li>
            <li className="flex space-x-4">
              <div>
                <Label htmlFor="hsn" className="text-right">
                  HSN
                </Label>
                <Input
                  id="hsn"
                  className={`col-span-3`}
                  value={hsn}
                  onChange={(e) => setHsn(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tsn" className="text-right">
                  TSN
                </Label>
                <Input
                  id="tsn"
                  className={`col-span-3`}
                  value={tsn}
                  onChange={(e) => setTsn(e.target.value)}
                />
              </div>
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onSave(model, brand, hsn, tsn);
              setOpenDialog(false);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
