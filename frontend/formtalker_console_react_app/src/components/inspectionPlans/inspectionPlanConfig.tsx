import React from "react";
import { MainCategoryInterface, SubCategoryInterface } from "./interfaces";

interface InspectionPlanConfigProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
}

export const InspectionPlanConfig: React.FC<InspectionPlanConfigProps> = ({
  categorys,
  subcategorys,
}) => {
  return (
    <>
      {categorys?.map((category) => (
        <div key={category.id}>
          <h1 className="underline text-3xl">{category.name}</h1>
          {subcategorys?.map((subcategory) => (
            <div>
              {subcategory.category_id === category.id && (
                <h2 className="underline text-2xl" key={subcategory.id}>
                  {subcategory.name}
                </h2>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
