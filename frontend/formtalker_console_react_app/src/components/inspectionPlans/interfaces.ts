export interface MainCategoryInterface {
  id: string;
  name: string;
}

export interface SubCategoryInterface {
  id: string;
  name: string;
  category_id: string;
}
