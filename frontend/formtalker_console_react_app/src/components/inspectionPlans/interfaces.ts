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
  id: string;
  fieldset_id: string;
  description: string;
}

export interface FormFieldInterface {
  id: string;
  description: string;
  fieldset_id: string;
}

export interface FieldsetInterface {
  id: string;
  fieldsetType: string;
  subcategory_id: string;
}
