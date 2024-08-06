export interface MainCategoryInterface {
  id: string;
  name: string;
}

export interface SubCategoryInterface {
  id: string;
  name: string;
  category_id: string;
}

export interface TaskInterface {
  fieldset_id: string;
  description: string;
}

export interface FormFieldInterface {
  formField_id: string;
  description: string;
}

export interface FieldsetInterface {
  id: string;
  fieldsetType: string;
  subcategory_id: string;
  formField_ids: string[];
}
