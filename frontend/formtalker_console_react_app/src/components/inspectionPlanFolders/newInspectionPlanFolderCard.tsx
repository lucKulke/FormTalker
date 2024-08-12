import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";

interface NewInspectionPlanFolderCardProps {
  model: string;
  brand: string;
  hsn: string;
  tsn: string;
  setCarName: React.Dispatch<React.SetStateAction<any>>;
  setBrand: React.Dispatch<React.SetStateAction<any>>;
  setHsn: React.Dispatch<React.SetStateAction<any>>;
  setTsn: React.Dispatch<React.SetStateAction<any>>;
  handleCreate: () => void;
}

export const NewInspectionPlanFolderCard: React.FC<
  NewInspectionPlanFolderCardProps
> = ({
  model,
  brand,
  hsn,
  tsn,
  setCarName,
  setBrand,
  setHsn,
  setTsn,
  handleCreate,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>New Folder</CardTitle>
          <CardDescription>
            Create a new folder for a specific car model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="model">Car model</Label>
                <Input
                  id="model"
                  placeholder="e.g. x5"
                  value={model}
                  onChange={(e) => setCarName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g. BMW"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <ul className="flex space-x-5">
                <li>
                  <div>
                    <Label htmlFor="hsn">HSN</Label>
                    <Input
                      id="hsn"
                      placeholder="e.g. 0005"
                      value={hsn}
                      onChange={(e) => setHsn(e.target.value)}
                    />
                  </div>
                </li>
                <li>
                  <div>
                    <Label htmlFor="tsn">TSN</Label>
                    <Input
                      id="tsn"
                      placeholder="e.g. ALQ"
                      value={tsn}
                      onChange={(e) => setTsn(e.target.value)}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              navigate(pageLinks.inspectionPlanFolders);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
