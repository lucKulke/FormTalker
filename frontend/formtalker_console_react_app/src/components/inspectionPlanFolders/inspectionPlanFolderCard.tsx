import { useState } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { deleteInspectionPlanFolder } from "@/services/supabase/inspectionPlanFolders";
import { useNavigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";

interface InspectionPlanFolderCardProps {
  model: string;
  id: string;
  brand: string;
  manufacturerCode: string;
  typeCode: string;
}

export const InspectionPlanFolderCard: React.FC<
  InspectionPlanFolderCardProps
> = ({ model, id, brand, manufacturerCode, typeCode }) => {
  const navigate = useNavigate();
  const [vehicleModel, setVehicleModel] = useState<string>(model);
  const [vehicleBrand, setVehicleBrand] = useState<string>(brand);
  const [vehicleManufacturerCode, setVehicleManufacturerCode] =
    useState<string>(manufacturerCode);
  const [vehicleTypeCode, setVehicleTypeCode] = useState<string>(typeCode);

  const handleDelete = () => {
    console.log(`delete ${id}`);
    const deleteFolder = async () => {
      const fetchedFolders = await deleteInspectionPlanFolder(id);
      if (fetchedFolders) {
      } else {
        console.log("error");
      }
    };

    deleteFolder();
  };
  const handleEdit = () => {
    console.log("edit");
  };

  const handleNavigateToFolder = () => {
    navigate(pageLinks.inspectionPlanFolder + `${id}`);
  };
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <ul className="flex justify-between">
          <li>
            <CardTitle>{vehicleModel}</CardTitle>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Brand</Label>
              <p className="text-sm">{vehicleBrand}</p>
            </div>
            <div className="">
              <Label htmlFor="vehicleTypes">Vehicle Type Codes</Label>
              <p className="text-sm">
                {vehicleManufacturerCode} {vehicleTypeCode}
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div></div>
        <Button onClick={handleNavigateToFolder}>Inspection Plans</Button>
      </CardFooter>
    </Card>
  );
};
