import React from "react";
import {
  MainCategoryInterface,
  SubCategoryInterface,
  TaskInterface,
  FieldsetInterface,
  FormFieldInterface,
} from "./interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { IoAddCircle } from "react-icons/io5";
import { AddFieldset } from "./dialogs/addFieldset";

interface InspectionPlanConfigProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
  tasks: TaskInterface[] | null;
  fieldsets: FieldsetInterface[] | null;
  formFields: FormFieldInterface[] | null;
  availableFieldsetTypesForSubcategorys: any;
  onAddFieldset: (typesToAdd: string[], subcategoryId: string) => void;
}

export const InspectionPlanConfig: React.FC<InspectionPlanConfigProps> = ({
  categorys,
  subcategorys,
  tasks,
  fieldsets,
  formFields,
  availableFieldsetTypesForSubcategorys,
  onAddFieldset,
}) => {
  const filterSubcategoryIds = (id: string) => {
    const filteredFieldsets = fieldsets?.filter((fieldset) => {
      return fieldset.subcategory_id == id;
    });
    return filteredFieldsets;
  };

  function sortFieldsets(a: FieldsetInterface, b: FieldsetInterface) {
    if (a.fieldsetType < b.fieldsetType) {
      return -1;
    }
    if (a.fieldsetType > b.fieldsetType) {
      return 1;
    }
    return 0;
  }

  return (
    <div>
      {categorys?.map((category) => (
        <div key={category.id}>
          <h1 className="underline text-3xl">{category.name}</h1>
          {subcategorys?.map((subcategory) => (
            <div>
              {subcategory.category_id === category.id && (
                <>
                  <div className="flex group">
                    <h2 className="underline text-2xl" key={subcategory.id}>
                      {subcategory.name}
                    </h2>
                    {availableFieldsetTypesForSubcategorys[subcategory.id] &&
                      availableFieldsetTypesForSubcategorys[subcategory.id]
                        .length !== 0 && (
                        <AddFieldset
                          subcategoryId={subcategory.id}
                          onSave={onAddFieldset}
                          addableFieldsetTypes={
                            availableFieldsetTypesForSubcategorys[
                              subcategory.id
                            ]
                          }
                        >
                          <button className="ml-1 mt-1">
                            <IoAddCircle className="h-6 w-6 text-gray-400 hover:text-black hidden group-hover:block" />
                          </button>
                        </AddFieldset>
                      )}
                  </div>
                  {fieldsets?.sort(sortFieldsets).map((fieldset) => (
                    <div>
                      {fieldset.subcategory_id == subcategory.id && (
                        <div>
                          <div className="flex">
                            <h3 className="ml-2 underline">
                              {fieldset.fieldsetType}
                            </h3>
                          </div>
                          <div className="flex">
                            <div className="ml-7">
                              <p className="font-bold">Fields</p>
                              {fieldset?.formField_ids.map((formField_id) => (
                                <div>
                                  {formFields
                                    ?.filter(function (formField) {
                                      return (
                                        formField.formField_id === formField_id
                                      );
                                    })
                                    .map((formField) => (
                                      <div className="border-2 pl-2 pr-2 flex mb-2 rounded-lg">
                                        <p className="mr-2 font-bold">
                                          {formField.formField_id}
                                        </p>
                                        <p>{formField.description}</p>
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>
                            <div className="ml-7">
                              {fieldset.fieldsetType === "Checkbox" && (
                                <p className="font-bold">Tasks</p>
                              )}
                              {tasks
                                ?.filter(function (task) {
                                  return task.fieldset_id === fieldset.id;
                                })
                                .map((task) => (
                                  <div>{task.description}</div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
