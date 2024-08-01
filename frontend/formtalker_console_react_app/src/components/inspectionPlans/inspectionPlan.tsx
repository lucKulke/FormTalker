import { useState, useRef } from "react";
import { Sidebar } from "@/components/inspectionPlans/sidebar";
import { InspectionPlanConfig } from "@/components/inspectionPlans/inspectionPlanConfig";
import {
  MainCategoryInterface,
  SubCategoryInterface,
  TaskInterface,
  FieldsetInterface,
  FormFieldInterface,
} from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import { Transition } from "@headlessui/react";
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
  { id: "1", name: "Elektrik" },
  { id: "2", name: "Bereifung" },
];

const subCategorysData = [
  { id: "2", name: "Frontbeleuchtung", category_id: "1", fieldset_id: "23" },
  { id: "1", name: "Heckbeleuchtung", category_id: "1" },
  { id: "10", name: "Reifenart", category_id: "2" },
  { id: "11", name: "Luftdruck", category_id: "2" },
  { id: "12", name: "Bereifung VR", category_id: "2" },
];

const tasksData = [
  { fieldset_id: "23", description: "Reifenart eintragen" },

  { fieldset_id: "26", description: "Luftdruck aller 4 räder prüfen" },
  { fieldset_id: "27", description: "Zustand" },
  { fieldset_id: "27", description: "Laufbild" },
];
const fieldsetsData = [
  {
    id: "23",
    category: "checkbox",
    subcategory_id: "10",
    formField_ids: ["30", "31", "32"],
  },
  {
    id: "24",
    category: "text",
    subcategory_id: "10",
    formField_ids: ["36"],
  },
  {
    id: "25",
    category: "individualcheckbox",
    subcategory_id: "10",
    formField_ids: ["37", "38", "88"],
  },

  {
    id: "26",
    category: "checkbox",
    subcategory_id: "11",
    formField_ids: ["33", "34", "35"],
  },
  {
    id: "27",
    category: "checkbox",
    subcategory_id: "12",
    formField_ids: ["39", "40", "41"],
  },
  {
    id: "28",
    category: "text",
    subcategory_id: "12",
    formField_ids: ["42"],
  },
];

const formFieldsData = [
  {
    formField_id: "30",
    description: "in ordung",
  },
  {
    formField_id: "31",
    description: "nicht ordung",
  },
  {
    formField_id: "32",
    description: "behoben",
  },
  {
    formField_id: "33",
    description: "in ordung",
  },
  {
    formField_id: "34",
    description: "nicht ordung",
  },
  {
    formField_id: "35",
    description: "behoben",
  },

  { formField_id: "36", description: "Reifengröße" },
  { formField_id: "37", description: "Sommerreifen" },
  { formField_id: "38", description: "Winterreifen" },
  { formField_id: "88", description: "Ganzjahresreifen" },
  {
    formField_id: "39",
    description: "in ordung",
  },
  {
    formField_id: "40",
    description: "nicht ordung",
  },
  {
    formField_id: "41",
    description: "behoben",
  },
  {
    formField_id: "42",
    description: "Profieltiefe in mm",
  },
];

export const InspectionPlan: React.FC = () => {
  const [tasks, setTasks] = useState<TaskInterface[] | null>(tasksData);
  const [fieldsets, setFieldsets] = useState<FieldsetInterface[] | null>(
    fieldsetsData
  );
  const [formFields, setFormFields] = useState<FormFieldInterface[] | null>(
    formFieldsData
  );

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

  const handleEditCategoryName = (category_id: string, newName: string) => {
    if (categorys) {
      const categorysCopy = [...categorys];
      categorysCopy.forEach((element) => {
        if (element.id === category_id) {
          element.name = newName;
        }
      });
      setCategorys(categorysCopy);
    }
  };

  const handleEditSubCategoryName = (category_id: string, newName: string) => {
    if (subcategorys) {
      const subcategorysCopy = [...subcategorys];
      subcategorysCopy.forEach((element) => {
        if (element.id === category_id) {
          element.name = newName;
        }
      });
      setSubcategorys(subcategorysCopy);
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
          onEditCategoryName={handleEditCategoryName}
          onEditSubCategoryName={handleEditSubCategoryName}
        />
        <div className="flex-1 p-4 overflow-auto h-full">
          <InspectionPlanConfig
            categorys={categorys}
            subcategorys={subcategorys}
            tasks={tasks}
            fieldsets={fieldsets}
            formFields={formFields}
          />
        </div>
      </div>
    </div>
  );
};
