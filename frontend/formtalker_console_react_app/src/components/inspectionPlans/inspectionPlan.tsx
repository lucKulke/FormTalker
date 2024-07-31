import { useState, useRef } from "react";
import { Sidebar } from "@/components/inspectionPlans/sideBar";
import { InspectionPlanConfig } from "@/components/inspectionPlans/inspectionPlanConfig";
import { MainCategoryInterface, SubCategoryInterface } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import { AddCategoryDialog } from "@/components/inspectionPlans/dialogs/addCategoryDialog";

const exampleData = {
  "Elektrik und elektronische Fahrzeugsysteme": {
    Frontbeleuchtung: {
      checkbox: {
        tasks: ["standlicht prüfen", "Abblendlicht prüfen", "Fernlicht prüfen"],
        fields: {
          "3": "in ordnung",
          "4": "nicht in ordnung",
          "5": "behoben",
        },
        indevidual: {},
      },
      text: {},
    },
    Heckbeleuchtung: {
      checkbox: {
        tasks: [
          "Bremslicht prüfen",
          "Rücklichter prüfen",
          "Kennzeichenbeleuchtung prüfen",
        ],
        fields: {
          "6": "in ordnung",
          "7": "nicht in ordnung",
          "8": "behoben",
        },
        indevidual: {},
      },
      text: {},
    },
  },
  Bereifung: {
    Reifenart: {
      checkbox: {
        tasks: ["Reifenart prüfen"],
        fields: {
          "3": "in ordnung",
          "4": "nicht in ordnung",
          "5": "behoben",
        },
        indevidual: {
          "7": "Sommerreifen",
          "8": "Winterreifen",
        },
      },
      text: {
        "3": "Reifen größe",
      },
    },
  },
};

const categorysData = [
  { id: "3", name: "Elektrik" },
  { id: "4", name: "Reifen" },
];

const subCategorysData = [
  { id: "2", name: "Frontbeleuchtung", category_id: "3" },
  { id: "1", name: "Heckbeleuchtung", category_id: "3" },
  { id: "10", name: "Profil", category_id: "4" },
];
export const InspectionPlan: React.FC = () => {
  const [categorys, setCategorys] = useState<MainCategoryInterface[] | null>(
    categorysData
  );
  const [subcategorys, setSubcategorys] = useState<
    SubCategoryInterface[] | null
  >(subCategorysData);

  const handleAddCategory = (name: string) => {
    const newItem: MainCategoryInterface = { name: name, id: uuidv4() };
    setCategorys((prevState) => {
      const updatedState = prevState ? [...prevState, newItem] : [newItem];
      return updatedState;
    });
  };

  const handleAddSubcategory = (category_id: string, name: string) => {
    const newItem: SubCategoryInterface = {
      name: name,
      id: uuidv4(),
      category_id: category_id,
    };
    setSubcategorys((prevState) => {
      const updatedState = prevState ? [...prevState, newItem] : [newItem];
      return updatedState;
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (categorys) {
      const newCategorysArray = [...categorys].filter(function (category) {
        return category.id !== id;
      });
      setCategorys(newCategorysArray);
    }
  };

  const handleDeleteSubcategory = (id: string) => {
    if (subcategorys) {
      const newSubcategorysArray = [...subcategorys].filter(function (
        subcategory
      ) {
        return subcategory.id !== id;
      });
      setSubcategorys(newSubcategorysArray);
    }
  };

  return (
    <div>
      <div className="flex h-[calc(100vh-5rem)]">
        <Sidebar
          categorys={categorys}
          subcategorys={subcategorys}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubcategory={handleDeleteSubcategory}
          onAddSubcategory={handleAddSubcategory}
        />
        <div className="flex-1 p-4 overflow-auto h-full">
          <InspectionPlanConfig
            categorys={categorys}
            subcategorys={subcategorys}
          />
        </div>
      </div>
    </div>
  );
};
