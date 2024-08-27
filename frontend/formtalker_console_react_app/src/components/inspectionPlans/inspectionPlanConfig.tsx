import React from "react";
import {
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
import { AddFieldsetDialog } from "./dialogs/addFieldset";
import { FaMinusCircle } from "react-icons/fa";
import { AddNewFormFieldDialog } from "./dialogs/addNewField";
import { AddSubtaskDialog } from "./dialogs/addSubtask";
import { EditFormFieldDialog } from "./dialogs/editFormField";
import {
  MainCategoryResponseInterface,
  SubCategoryResponseInterface,
} from "@/services/supabase/inspectionPlanFormData";

interface InspectionPlanConfigProps {
  categorys: MainCategoryResponseInterface[] | null;
  subcategorys: SubCategoryResponseInterface[] | null;
  tasks: TaskInterface[] | null;
  fieldsets: FieldsetInterface[] | null;
  formFields: FormFieldInterface[] | null;
  availableFieldsetTypesForSubcategorys: any;
  onAddFieldset: (typesToAdd: string[], subcategoryId: string) => void;
  onDeleteFieldset: (fieldsetId: string) => void;
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  allAvailableFormFieldIds: string[];
  onAddFormField: (
    fieldsetId: string,
    formFieldDescription: string,
    formFieldId: string
  ) => void;
  onAddSubtask: (fieldsetId: string, taskDescription: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onEditFormField: (
    formFieldId: string,
    newFormFieldDescription: string
  ) => void;
  onDeleteFormField: (formFieldId: string, fieldsetId: string) => void;
}

export const InspectionPlanConfig: React.FC<InspectionPlanConfigProps> = ({
  categorys,
  subcategorys,
  tasks,
  fieldsets,
  formFields,
  availableFieldsetTypesForSubcategorys,
  onAddFieldset,
  onDeleteFieldset,
  sectionRefs,
  allAvailableFormFieldIds,
  onAddFormField,
  onAddSubtask,
  onDeleteSubtask,
  onEditFormField,
  onDeleteFormField,
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
        <div
          key={category.id}
          ref={(el) => (sectionRefs.current[category.id] = el)}
        >
          <h1 className="underline text-3xl font-bold">{category.name}</h1>
          {subcategorys?.map((subcategory) => (
            <div className="ml-3" key={subcategory.id}>
              {subcategory.main_category_id === category.id && (
                <>
                  <div className="flex group mt-4">
                    <h2
                      className="underline text-2xl"
                      ref={(el) => (sectionRefs.current[subcategory.id] = el)}
                      key={subcategory.id}
                    >
                      {subcategory.name}
                    </h2>
                    {availableFieldsetTypesForSubcategorys[subcategory.id] &&
                      availableFieldsetTypesForSubcategorys[subcategory.id]
                        .length !== 0 && (
                        <AddFieldsetDialog
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
                        </AddFieldsetDialog>
                      )}
                  </div>
                  {fieldsets?.sort(sortFieldsets).map((fieldset) => (
                    <div key={fieldset.id}>
                      {fieldset.subcategory_id == subcategory.id && (
                        <div className="mt-2 border-2 rounded-lg p-2 hover:border-black hover:shadow-xl mr-2">
                          <div className="flex group">
                            <h3 className="ml-2 font-mono">
                              {fieldset.fieldsetType}
                            </h3>
                            <button
                              className="ml-1"
                              onClick={() => onDeleteFieldset(fieldset.id)}
                            >
                              <FaMinusCircle className="h-4 w-4 text-gray-400 hover:text-black hidden group-hover:block" />
                            </button>
                          </div>
                          <div className="flex mt-2 ">
                            <div className="ml-7">
                              <div className="flex group">
                                <p className="font-bold">Fields</p>
                                <AddNewFormFieldDialog
                                  fieldsetId={fieldset.id}
                                  onSave={onAddFormField}
                                  availableIds={allAvailableFormFieldIds}
                                >
                                  <button className="ml-1">
                                    <IoAddCircle className="h-5 w-5 text-gray-400 hover:text-black hidden group-hover:block" />
                                  </button>
                                </AddNewFormFieldDialog>
                              </div>
                              {formFields
                                ?.filter(function (formField) {
                                  return formField.fieldset_id === fieldset.id;
                                })
                                .map((formField) => (
                                  <EditFormFieldDialog
                                    key={formField.id}
                                    onSave={onEditFormField}
                                    onDelete={onDeleteFormField}
                                    fieldsetId={fieldset.id}
                                    formFieldId={formField.id}
                                    prevFormFieldDescription={
                                      formField.description
                                    }
                                  >
                                    <button className="border-2 mb-2 mt-2 flex pl-2 pr-2 border-gray-300 hover:border-black hover:shadow-xl rounded-lg">
                                      <p className="mr-2 font-bold">
                                        {formField.id}
                                      </p>
                                      <p>{formField.description}</p>
                                    </button>
                                  </EditFormFieldDialog>
                                ))}
                            </div>
                            <div className="ml-7">
                              {fieldset.fieldsetType === "Checkbox" && (
                                <div className="flex group">
                                  <p className="font-bold">Tasks</p>
                                  <AddSubtaskDialog
                                    fieldsetId={fieldset.id}
                                    onSave={onAddSubtask}
                                  >
                                    <button className="ml-1">
                                      <IoAddCircle className="h-5 w-5 text-gray-400 hover:text-black hidden group-hover:block" />
                                    </button>
                                  </AddSubtaskDialog>
                                </div>
                              )}
                              {tasks
                                ?.filter(function (task) {
                                  return task.fieldset_id === fieldset.id;
                                })
                                .map((task) => (
                                  <div
                                    key={task.description}
                                    className="flex group"
                                  >
                                    <p>- {task.description}</p>
                                    <button
                                      className="ml-1 mt-1"
                                      onClick={() => onDeleteSubtask(task.id)}
                                    >
                                      <FaMinusCircle className="h-4 w-4 text-gray-400 hover:text-black hidden group-hover:block" />
                                    </button>
                                  </div>
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
