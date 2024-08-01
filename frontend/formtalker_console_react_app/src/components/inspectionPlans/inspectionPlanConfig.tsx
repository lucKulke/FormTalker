import React from "react";
import {
  MainCategoryInterface,
  SubCategoryInterface,
  TaskInterface,
  FieldsetInterface,
  FormFieldInterface,
} from "./interfaces";
interface InspectionPlanConfigProps {
  categorys: MainCategoryInterface[] | null;
  subcategorys: SubCategoryInterface[] | null;
  tasks: TaskInterface[] | null;
  fieldsets: FieldsetInterface[] | null;
  formFields: FormFieldInterface[] | null;
}

export const InspectionPlanConfig: React.FC<InspectionPlanConfigProps> = ({
  categorys,
  subcategorys,
  tasks,
  fieldsets,
  formFields,
}) => {
  const filterSubcategoryIds = (id: string) => {
    const filteredFieldsets = fieldsets?.filter((fieldset) => {
      return fieldset.subcategory_id == id;
    });
    return filteredFieldsets;
  };

  return (
    <>
      {categorys?.map((category) => (
        <div key={category.id}>
          <h1 className="underline text-3xl">{category.name}</h1>
          {subcategorys?.map((subcategory) => (
            <div>
              {subcategory.category_id === category.id && (
                <>
                  <h2 className="underline text-2xl" key={subcategory.id}>
                    {subcategory.name}
                  </h2>
                  {fieldsets?.map((fieldset) => (
                    <div>
                      {fieldset.subcategory_id == subcategory.id && (
                        <div>
                          <h3 className="ml-2 underline">
                            {fieldset.category}
                          </h3>
                          <div className="flex">
                            <div>
                              {fieldset?.formField_ids.map((formField_id) => (
                                <div>
                                  {formFields
                                    ?.filter(function (formField) {
                                      return (
                                        formField.formField_id === formField_id
                                      );
                                    })
                                    .map((formField) => (
                                      <div className="ml-7">
                                        {formField.description}
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>
                            <div>
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
    </>
  );
};
