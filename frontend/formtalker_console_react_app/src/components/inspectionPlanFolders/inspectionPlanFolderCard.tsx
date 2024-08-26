import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useNavigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";
import { CiSquareCheck } from "react-icons/ci";

interface InspectionPlanFolderCardProps {
  model: string;
  id: string;
  brand: string;
  manufacturerCode: string;
  typeCode: string;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    model: string,
    brand: string,
    hsn: string,
    tsn: string
  ) => void;
}

export const InspectionPlanFolderCard: React.FC<
  InspectionPlanFolderCardProps
> = ({ model, id, brand, manufacturerCode, typeCode, onDelete, onUpdate }) => {
  const navigate = useNavigate();

  const [vehicleModel, setVehicleModel] = useState<string>(model);
  const [vehicleBrand, setVehicleBrand] = useState<string>(brand);
  const [vehicleManufacturerCode, setVehicleManufacturerCode] =
    useState<string>(manufacturerCode);
  const [vehicleTypeCode, setVehicleTypeCode] = useState<string>(typeCode);
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleNavigateToFolder = () => {
    navigate(pageLinks.inspectionPlanFolder + `${id}`);
  };
  return (
    <Card className="w-[300px] hover:border-black hover:shadow-xl">
      <CardHeader>
        <ul className="flex justify-between">
          {editMode ? (
            <li>
              <Input
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </li>
          ) : (
            <li>
              <CardTitle>{vehicleModel}</CardTitle>
            </li>
          )}
          {editMode ? (
            <li className="pt-1">
              <button
                onClick={() => {
                  onUpdate(
                    id,
                    vehicleModel,
                    vehicleBrand,
                    vehicleManufacturerCode,
                    vehicleTypeCode
                  );
                  setEditMode(false);
                }}
              >
                <CiSquareCheck className="w-7 h-7 bg-green-500 rounded-md hover:bg-green-300 active:bg-green-500" />
              </button>
            </li>
          ) : (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEditMode(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )}
        </ul>
      </CardHeader>
      <CardContent className={`${editMode ? "" : "mb-8"}`}>
        <ul className="space-y-3">
          {editMode ? (
            <li>
              <Label htmlFor={`brandInput${id}`}>Brand</Label>
              <Input
                id={`brandInput${id}`}
                value={vehicleBrand}
                onChange={(e) => setVehicleBrand(e.target.value)}
              />
            </li>
          ) : (
            <li>
              <h2 className="text-sm font-mono text-slate-600">Brand</h2>
              <p className="text-xl">{vehicleBrand}</p>
            </li>
          )}

          {editMode ? (
            <li className="flex space-x-2">
              <div>
                <Label htmlFor={`hsn${id}`}>HSN</Label>
                <Input
                  id={`hsn${id}`}
                  value={vehicleManufacturerCode}
                  onChange={(e) => setVehicleManufacturerCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`tsn${id}`}>TSN</Label>
                <Input
                  id={`tsn${id}`}
                  value={vehicleTypeCode}
                  onChange={(e) => setVehicleTypeCode(e.target.value)}
                />
              </div>
            </li>
          ) : (
            <li>
              <h2 className="text-sm font-mono text-slate-600">
                Vehicle Type Codes
              </h2>
              <p className="text-xl">
                {vehicleManufacturerCode} {vehicleTypeCode}
              </p>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div></div>
        <Button onClick={handleNavigateToFolder}>Inspection Plans</Button>
      </CardFooter>
    </Card>
  );
};
