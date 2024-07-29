import React, { useEffect, useState } from "react";

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
import {
  fetchInspectionPlanFolderItems,
  InspectionPlanFolderItems,
} from "@/services/supabase/inspectionPlanFolders";
export function InspectionPlanFolder() {
  const { folderId } = useParams();
  const [error, setError] = useState<string>();
  const [inspectionPlans, setInspectionPlans] =
    useState<InspectionPlanFolderItems[]>();

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

  const loadInspectionPlans = async () => {
    try {
      const fetchedItems = await fetchInspectionPlanFolderItems();

      if (fetchedItems) {
        setInspectionPlans(fetchedItems);
      } else {
        console.log("error");
        setError("No folders found");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "inspection_plans" },
        (payload) => {
          console.log("Change received!", payload);

          loadInspectionPlans();
        }
      )
      .subscribe();

    loadInspectionPlans();

    return () => {
      // Cleanup subscription on component unmount
      supabase.removeChannel(subscription);
    };
  }, []);

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
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created at</th>
                  <th className="px-4 py-2 text-left">Created from</th>
                </tr>
              </thead>
              <tbody>
                {inspectionPlans &&
                  inspectionPlans.map((inspection) => (
                    <tr
                      key={inspection.id}
                      className="border-t border-gray-200"
                    >
                      <td className="px-4 py-2 text-left">
                        {inspection.inspection_type}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {inspection.milage}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {inspection.status}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {inspection.created_at}
                      </td>
                      <td className="px-4 py-2 text-left">
                        {inspection.created_from}
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
