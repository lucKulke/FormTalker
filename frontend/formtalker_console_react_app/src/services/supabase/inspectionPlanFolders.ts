import { supabase } from "@/utils/supabaseCleint";

const inspection_plan_folders_table_name = "folders";
const inspection_plan_head_data_table_name = "inspection_plan_head_data";

export interface AddInspectionPlanFolder {
  model: string;
  brand: string;
  manufacturer_code: string;
  type_code: string;
}

export interface InspectionPlanFolder {
  id: string; // Assuming there's an 'id' field for the folder
  model: string;
  brand: string;
  manufacturer_code: string;
  type_code: string;
  // Add any other fields that might be returned by the Supabase query
}

export async function fetchInspectionPlanFolders(): Promise<
  InspectionPlanFolder[] | null
> {
  try {
    let { data: inspection_plan_folders, error } = await supabase
      .from(inspection_plan_folders_table_name)
      .select("*");

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return inspection_plan_folders;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return null;
  }
}

export async function addInspectionPlanFolder(
  params: AddInspectionPlanFolder
): Promise<InspectionPlanFolder[]> {
  try {
    const { data, error } = await supabase
      .from(inspection_plan_folders_table_name)
      .insert([
        {
          model: params.model,
          brand: params.brand,
          manufacturer_code: params.manufacturer_code,
          type_code: params.type_code,
        },
      ])
      .select();
    if (error) throw new Error(error.message);
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error resetting password: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function deleteInspectionPlanFolder(id: string): Promise<boolean> {
  try {
    await deleteAllInspectionPlan(id);
    console.log("deleted all inspection plans");
    const { error } = await supabase
      .from(inspection_plan_folders_table_name)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return false;
  }
}

export async function deleteAllInspectionPlan(
  folder_id: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(inspection_plan_head_data_table_name)
      .delete()
      .eq("folder_id", folder_id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return false;
  }
}
