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
import { FaMinusCircle } from "react-icons/fa";
import { AddNewFormField } from "./dialogs/addNewField";
import { AddSubtask } from "./dialogs/addSubtask";
import { EditFormField } from "./dialogs/editFormField";

interface InspectionPlanConfigProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
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
            <div className="ml-3">
              {subcategory.category_id === category.id && (
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
                    <div key={fieldset.id}>
                      {fieldset.subcategory_id == subcategory.id && (
                        <div className="mt-2 border-2 rounded-lg p-2 hover:border-black">
                          <div className="flex group">
                            <h3 className="ml-2 font-mono">
                              {fieldset.fieldsetType}
                            </h3>
                            <button
                              className="ml-1 mt-1"
                              onClick={() => onDeleteFieldset(fieldset.id)}
                            >
                              <FaMinusCircle className="h-4 w-4 text-gray-400 hover:text-black hidden group-hover:block" />
                            </button>
                          </div>
                          <div className="flex mt-2 ">
                            <div className="ml-7">
                              <div className="flex group">
                                <p className="font-bold">Fields</p>
                                <AddNewFormField
                                  fieldsetId={fieldset.id}
                                  onSave={onAddFormField}
                                  availableIds={allAvailableFormFieldIds}
                                >
                                  <button className="ml-1">
                                    <IoAddCircle className="h-5 w-5 text-gray-400 hover:text-black hidden group-hover:block" />
                                  </button>
                                </AddNewFormField>
                              </div>
                              {fieldset?.formField_ids.map((formField_id) => (
                                <div>
                                  {formFields
                                    ?.filter(function (formField) {
                                      return (
                                        formField.formField_id === formField_id
                                      );
                                    })
                                    .map((formField) => (
                                      <EditFormField
                                        key={formField.formField_id}
                                        onSave={onEditFormField}
                                        onDelete={onDeleteFormField}
                                        fieldsetId={fieldset.id}
                                        formFieldId={formField.formField_id}
                                        prevFormFieldDescription={
                                          formField.description
                                        }
                                      >
                                        <button className="border-2 mb-2 mt-2 flex pl-2 pr-2 border-gray-300 hover:border-black shadow-xl rounded-lg">
                                          <p className="mr-2 font-bold">
                                            {formField.formField_id}
                                          </p>
                                          <p>{formField.description}</p>
                                        </button>
                                      </EditFormField>
                                    ))}
                                </div>
                              ))}
                            </div>
                            <div className="ml-7">
                              {fieldset.fieldsetType === "Checkbox" && (
                                <div className="flex group">
                                  <p className="font-bold">Tasks</p>
                                  <AddSubtask
                                    fieldsetId={fieldset.id}
                                    onSave={onAddSubtask}
                                  >
                                    <button className="ml-1">
                                      <IoAddCircle className="h-5 w-5 text-gray-400 hover:text-black hidden group-hover:block" />
                                    </button>
                                  </AddSubtask>
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
