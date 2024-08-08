import { useState, useRef, useEffect } from "react";
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
import { FormField } from "../ui/form";
import { Description } from "@radix-ui/react-dialog";

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
  { fieldset_id: "23", description: "Reifenart eintragen", id: "34" },

  {
    fieldset_id: "26",
    description: "Luftdruck aller 4 räder prüfen",
    id: "32",
  },
  { fieldset_id: "27", description: "Zustand", id: "14" },
  { fieldset_id: "27", description: "Laufbild", id: "44" },
];
const fieldsetsData = [
  {
    id: "23",
    fieldsetType: "Checkbox",
    subcategory_id: "10",
    formField_ids: ["30", "31", "32"],
  },
  {
    id: "24",
    fieldsetType: "Text",
    subcategory_id: "10",
    formField_ids: ["36"],
  },
  {
    id: "25",
    fieldsetType: "Individual checkbox",
    subcategory_id: "10",
    formField_ids: ["37", "38", "88"],
  },

  {
    id: "26",
    fieldsetType: "Checkbox",
    subcategory_id: "11",
    formField_ids: ["33", "34", "35"],
  },
  {
    id: "27",
    fieldsetType: "Checkbox",
    subcategory_id: "12",
    formField_ids: ["39", "40", "41"],
  },
  {
    id: "28",
    fieldsetType: "Text",
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
  { formField_id: "55", description: "" },
  { formField_id: "66", description: "" },
  { formField_id: "73", description: "" },
  { formField_id: "74", description: "" },
  { formField_id: "75", description: "" },
  { formField_id: "76", description: "" },
  { formField_id: "77", description: "" },
  { formField_id: "78", description: "" },
  { formField_id: "79", description: "" },
  { formField_id: "80", description: "" },
  { formField_id: "81", description: "" },
  { formField_id: "82", description: "" },
];

const availableFieldsetTypesData = ["Checkbox", "Individual checkbox", "Text"];

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

  const [allAvailableFormFieldIds, setAllAvailableFormFieldIds] = useState(
    formFieldsData
      .filter((fieldset) => {
        return fieldset.description === "";
      })
      .map((fieldset) => fieldset.formField_id)
  );

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

  const handleAddFieldset = (typesToAdd: string[], subcategoryId: string) => {
    if (fieldsets) {
      let copyOfFieldsets = [...fieldsets];
      typesToAdd.forEach((fieldsetTypeName) => {
        copyOfFieldsets.push({
          id: uuidv4(),
          fieldsetType: fieldsetTypeName,
          formField_ids: [],
          subcategory_id: subcategoryId,
        });
      });
      setFieldsets(copyOfFieldsets);
    }
  };

  const handleDeleteFieldset = (fieldsetId: string) => {
    if (fieldsets) {
      let copyOfFieldsets = [...fieldsets];
      copyOfFieldsets = copyOfFieldsets.filter(function (fieldset) {
        return fieldset.id !== fieldsetId;
      });

      setFieldsets(copyOfFieldsets);
    }
  };

  const handleAddFormField = (
    fieldsetId: string,
    formFieldDescription: string,
    formFieldId: string
  ) => {
    if (formFields && fieldsets) {
      let copyOfFormFields = [...formFields];
      copyOfFormFields.forEach((formField) => {
        if (formField.formField_id === formFieldId) {
          formField.description = formFieldDescription;
        }
      });
      setFormFields(copyOfFormFields);
      let copyOfFieldsets = [...fieldsets];
      copyOfFieldsets.forEach((fieldset) => {
        if (fieldset.id === fieldsetId) {
          fieldset.formField_ids.push(formFieldId);
        }
      });
      setFieldsets(copyOfFieldsets);
    }
  };

  const handleDeleteFormField = (formFieldId: string, fieldsetId: string) => {
    if (formFields && fieldsets) {
      let copyOfFormFields = [...formFields];
      copyOfFormFields = copyOfFormFields.filter((formField) => {
        return formField.formField_id !== formFieldId;
      });

      let copyOfFieldsets = [...fieldsets];
      copyOfFieldsets.forEach((fieldset) => {
        if (fieldset.id === fieldsetId) {
          fieldset.formField_ids = fieldset.formField_ids.filter((id) => {
            return id !== formFieldId;
          });
        }
      });
      setFormFields(copyOfFormFields);
      setFieldsets(copyOfFieldsets);
    }
  };

  const handleEditFormField = (
    formFieldId: string,
    newFormFieldDescription: string
  ) => {
    if (formFields) {
      let copyOfFormFields = [...formFields];
      copyOfFormFields.forEach((formField) => {
        if (formField.formField_id === formFieldId) {
          formField.description = newFormFieldDescription;
        }
      });
      setFormFields(copyOfFormFields);
    }
  };

  const handleAddSubtask = (fieldsetId: string, taskDescription: string) => {
    if (tasks) {
      let copyOfTasks = [...tasks];
      copyOfTasks.push({
        id: uuidv4(),
        fieldset_id: fieldsetId,
        description: taskDescription,
      });
      setTasks(copyOfTasks);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (tasks) {
      let copyOfTasks = [...tasks];
      copyOfTasks = copyOfTasks.filter((task) => {
        return task.id !== subtaskId;
      });
      setTasks(copyOfTasks);
    }
  };

  const [allAvailableFieldsetTypes, setAllAvailableFieldsetTypes] = useState(
    availableFieldsetTypesData
  );

  function getAddableFieldsetTypes(subcategory_id: string) {
    let addableFieldsetTypes = [...allAvailableFieldsetTypes];
    fieldsets?.forEach((fieldset) => {
      if (fieldset.subcategory_id === subcategory_id) {
        addableFieldsetTypes = addableFieldsetTypes.filter(function (
          fieldsetTypeName
        ) {
          return fieldsetTypeName !== fieldset.fieldsetType;
        });
      }
    });

    return addableFieldsetTypes;
  }

  const [
    availableFieldsetTypesForSubcategorys,
    setAvailableFieldsetTypesForSubcategorys,
  ] = useState({});

  useEffect(() => {
    let data: any = {};
    subcategorys?.forEach((subcategory) => {
      data[subcategory.id] = getAddableFieldsetTypes(subcategory.id);
    });
    setAvailableFieldsetTypesForSubcategorys(data);
  }, []);

  useEffect(() => {
    let data: any = {};
    subcategorys?.forEach((subcategory) => {
      data[subcategory.id] = getAddableFieldsetTypes(subcategory.id);
    });
    setAvailableFieldsetTypesForSubcategorys(data);
  }, [fieldsets, subcategorys]);

  useEffect(() => {
    setAllAvailableFormFieldIds(
      formFieldsData
        .filter((fieldset) => {
          return fieldset.description === "";
        })
        .map((fieldset) => fieldset.formField_id)
    );
  }, [formFields]);

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  //
  return (
    <div className="mt-5 border-2 rounded-xl shadow-md border-black p-2">
      <div className="flex h-[calc(100vh-9rem)]">
        <Sidebar
          categorys={categorys}
          subcategorys={subcategorys}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubcategory={handleDeleteSubcategory}
          onAddSubcategory={handleAddSubcategory}
          onEditCategoryName={handleEditCategoryName}
          onEditSubCategoryName={handleEditSubCategoryName}
          scrollToSection={scrollToSection}
        />
        <div className="flex-1 ml-3 overflow-auto h-full">
          <InspectionPlanConfig
            categorys={categorys}
            subcategorys={subcategorys}
            tasks={tasks}
            fieldsets={fieldsets}
            formFields={formFields}
            availableFieldsetTypesForSubcategorys={
              availableFieldsetTypesForSubcategorys
            }
            onAddFieldset={handleAddFieldset}
            onDeleteFieldset={handleDeleteFieldset}
            sectionRefs={sectionRefs}
            allAvailableFormFieldIds={allAvailableFormFieldIds}
            onAddFormField={handleAddFormField}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onEditFormField={handleEditFormField}
            onDeleteFormField={handleDeleteFormField}
          />
        </div>
      </div>
    </div>
  );
};
