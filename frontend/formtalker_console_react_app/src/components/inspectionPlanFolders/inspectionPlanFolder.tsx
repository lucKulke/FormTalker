import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { supabase } from "@/utils/supabaseCleint";
import { MoreHorizontal } from "lucide-react";
import { IoMdAdd } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export function InspectionPlanFolder() {
  const { folderId } = useParams();

  const inspections = [
    {
      inspectionPlanId: "32",
      brand: "Toyota",
      vehicleModel: "Corolla",
      createDate: "2024-07-15",
      mileage: 45000,
      inspectionType: "Annual",
      createdFrom: "meister",
    },
    {
      inspectionPlanId: "32",
      brand: "Toyota",
      vehicleModel: "Corolla",
      createDate: "2024-07-15",
      mileage: 45000,
      inspectionType: "Annual",
      createdFrom: "meister",
    },
    // Add more inspection objects as needed
  ];

  return (
    <>
      <div className="container mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inspection Plans</h2>
          <Button className="rounded-full">
            <IoMdAdd className="h-7 w-7" />
          </Button>
        </div>
        <div className="overflow-x-auto mt-5">
          <div className="inline-block min-w-full shadow overflow-hidden">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Inspection Type</th>
                  <th className="px-4 py-2 text-left">Mileage</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-left">Vehicle Model</th>
                  <th className="px-4 py-2 text-left">Create Date</th>
                  <th className="px-4 py-2 text-left">Created From</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => (
                  <tr
                    key={inspection.inspectionPlanId}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-2 text-left">
                      {inspection.inspectionType}
                    </td>
                    <td className="px-4 py-2 text-left">
                      {inspection.mileage}
                    </td>
                    <td className="px-4 py-2 text-left">{inspection.brand}</td>
                    <td className="px-4 py-2 text-left">
                      {inspection.vehicleModel}
                    </td>
                    <td className="px-4 py-2 text-left">
                      {inspection.createDate}
                    </td>
                    <td className="px-4 py-2 text-left">
                      {inspection.createdFrom}
                    </td>
                    <td className="px-4 py-2 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
