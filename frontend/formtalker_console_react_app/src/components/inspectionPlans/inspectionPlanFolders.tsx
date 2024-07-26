import React from "react";
import { InspectionPlanFolderCard } from "@/components/inspectionPlans/inspectionPlanFolderCard";
import { Filter } from "@/components/inspectionPlans/filter";
export function InspectionPlanFolders() {
  const cards = [
    {
      carName: "Swift",
      carBrand: "Suzuki",
      id: "1",
      manufacturerCode: "0203",
      typeCode: "1343",
    },
    {
      carName: "RS6",
      carBrand: "Audi",
      id: "2",
      manufacturerCode: "0123",
      typeCode: "3993",
    },
    {
      carName: "T128",
      carBrand: "Mercedes",
      id: "3",
      manufacturerCode: "0303",
      typeCode: "3439",
    },
    {
      carName: "GT3 RS",
      carBrand: "Porsche",
      id: "4",
      manufacturerCode: "0033",
      typeCode: "3236",
    },
    // Add more cards as needed
  ];
  return (
    <div className="mt-7">
      <ul className="space-y-6">
        <li>
          <div className="flex justify-center">
            <Filter></Filter>
          </div>
        </li>
        <li>
          <div className="flex justify-center">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card, index) => (
                <InspectionPlanFolderCard
                  carName={card.carName}
                  carBrand={card.carBrand}
                  id={card.id}
                  manufacturerCode={card.manufacturerCode}
                  typeCode={card.typeCode}
                />
              ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
