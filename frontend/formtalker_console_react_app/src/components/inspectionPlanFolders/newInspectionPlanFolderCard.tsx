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
  carName: string;
  brand: string;
  hsn: string;
  tsn: string;
  setCarName: React.Dispatch<React.SetStateAction<any>>;
  setBrand: React.Dispatch<React.SetStateAction<any>>;
  setHsn: React.Dispatch<React.SetStateAction<any>>;
  setTsn: React.Dispatch<React.SetStateAction<any>>;
  handleCreate: () => void;
}

export function NewInspectionPlanFolderCard(
  params: NewInspectionPlanFolderCardProps
) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>New Folder</CardTitle>
          <CardDescription>
            Create a new Car Folder that holds inspectionplans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name of car</Label>
                <Input
                  id="name"
                  placeholder="car name"
                  value={params.carName}
                  onChange={(e) => params.setCarName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="car brand"
                  value={params.brand}
                  onChange={(e) => params.setBrand(e.target.value)}
                />
              </div>
              <ul className="flex space-x-5">
                <li>
                  <div>
                    <Label htmlFor="hsn">HSN</Label>
                    <Input
                      id="hsn"
                      placeholder="e.g. 0005"
                      value={params.hsn}
                      onChange={(e) => params.setHsn(e.target.value)}
                    />
                  </div>
                </li>
                <li>
                  <div>
                    <Label htmlFor="tsn">TSN</Label>
                    <Input
                      id="tsn"
                      placeholder="e.g. ALQ"
                      value={params.tsn}
                      onChange={(e) => params.setTsn(e.target.value)}
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
          <Button onClick={params.handleCreate}>Create</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
