import { supabase } from "@/utils/supabaseCleint";

const form_representation_data_schema_name = "form_representation_data"
const field_stets_table_name = "field_sets";
const form_field_positions_table_name = "form_field_postions"
const form_field_table_name = "form_fields"
const main_categorys_table_name = "main_categorys"
const sub_categorys_table_name = "sub_categorys"
const tasks_table_name = "tasks"

interface FieldSetResponseInterface {

}

interface FieldsetInterface {

}

interface FormFieldPositionResponseInterface {

}

interface FormFieldPositionInterface {

}

interface FormFieldResponseInterface {

}

interface FormFieldInterface {


}

export interface MainCategoryInterface {
    name: string
    inspection_plan_id: string
}
export interface MainCategoryResponseInterface extends MainCategoryInterface {
    id: string
    created_at: string
}
export interface SubCategoryInterface {
  name: string
  main_category_id: string
  inspection_plan_id: string

}
export interface SubCategoryResponseInterface extends SubCategoryInterface {
  id: string
  created_at: string
}

interface TaskResponseInterface {}

interface TaskInterface {

}

export async function fetchMainCategorys(
  inspectionPlanId: string
    
  ): Promise<MainCategoryResponseInterface[]> {
    try {
      const { data, error } = await supabase.schema(form_representation_data_schema_name)
        .from(main_categorys_table_name)
        .select("*").eq('inspection_plan_id', inspectionPlanId)
  
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching inspection plan folders: " + error.message);
      } else {
        console.error("An unknown error occurred");
      }
      return [];
    }
  }

export async function addMainCategory(newMainCategory: MainCategoryInterface): Promise<MainCategoryResponseInterface[]> {
  try {
    const { data, error } = await supabase.schema(form_representation_data_schema_name)
      .from(main_categorys_table_name)
      .insert([newMainCategory]).select()

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return [];
  }
}

  

export async function fetchSubCategorys(
  inspectionPlanId: string
): Promise<SubCategoryResponseInterface[]> {
  try {
    const { data, error } = await supabase.schema(form_representation_data_schema_name)
      .from(sub_categorys_table_name)
      .select("*").eq('inspection_plan_id', inspectionPlanId)

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return [];
  }
}

export async function addSubCategory(
  newSubCategory: SubCategoryInterface
): Promise<SubCategoryResponseInterface[]> {
  try {
    const { data, error } = await supabase.schema(form_representation_data_schema_name)
      .from(sub_categorys_table_name)
      .insert(newSubCategory).select()

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return [];
  }
}


  