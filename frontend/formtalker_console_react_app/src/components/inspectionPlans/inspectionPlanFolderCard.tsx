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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface inspectionPlanFolderCardProps {
  carName: string;
  id: string;
  carBrand: string;
  manufacturerCode: string;
  typeCode: string;
}

export function InspectionPlanFolderCard({
  carName,
  id,
  carBrand,
  manufacturerCode,
  typeCode,
}: inspectionPlanFolderCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{carName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Brand</Label>
              <p className="text-sm">{carBrand}</p>
            </div>
            <div className="">
              <Label htmlFor="vehicleTypes">Vehicle Type Codes</Label>
              <p className="text-sm">
                {manufacturerCode} {typeCode}
              </p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Inspection Plans</Button>
      </CardFooter>
    </Card>
  );
}
