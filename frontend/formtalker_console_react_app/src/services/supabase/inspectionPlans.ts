import { supabase } from "@/utils/supabaseCleint";

const inspection_plan_head_data_table_name = "inspection_plan_head_data";

export interface InspectionPlanHeadDataResponse {
  id: string;
  folder_id: string;
  inspection_type: string;
  description: string;
  millage: number | null;
  status: boolean;
  created_from: string;
  created_at: string;
  // Add any other fields that might be returned by the Supabase query
}

export interface InspectionPlanHeadData {
  folder_id: string;
  inspection_type: string;
  description: string;
  millage: number | null;
  status: boolean;
  created_from: string;

  // Add any other fields that might be returned by the Supabase query
}

export async function deleteInspectionPlanHeadData(
  id: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(inspection_plan_head_data_table_name)
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

export async function fetchFolderInspectionPlansHeadData(
  folder_id: string
): Promise<InspectionPlanHeadDataResponse[] | null> {
  try {
    let { data: inspection_plan_head_data, error } = await supabase
      .from(inspection_plan_head_data_table_name)
      .select("*")
      .eq("folder_id", folder_id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return inspection_plan_head_data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching inspection plan folders: " + error.message);
    } else {
      console.error("An unknown error occurred");
    }
    return null;
  }
}

export async function addInspectionPlanHeadData(
  headData: InspectionPlanHeadData
): Promise<InspectionPlanHeadDataResponse[] | null> {
  try {
    let { data, error } = await supabase
      .from(inspection_plan_head_data_table_name)
      .insert(headData)
      .select();

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
    return null;
  }
}

export async function updateStatusFromInspectionPlanHeadData(
  id: string,
  status: boolean
): Promise<InspectionPlanHeadDataResponse[] | null> {
  try {
    const { data, error } = await supabase
      .from(inspection_plan_head_data_table_name)
      .update({ status: status })
      .eq("id", id)
      .select();
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
    return null;
  }
}

export async function updateInspectionPlanHeadData(
  id: string,
  inspectionType: string,
  description: string,
  millage: number | null
): Promise<InspectionPlanHeadDataResponse[] | null> {
  try {
    const { data, error } = await supabase
      .from(inspection_plan_head_data_table_name)
      .update({
        inspection_type: inspectionType,
        description: description,
        millage: millage,
      })
      .eq("id", id)
      .select();
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
    return null;
  }
}
