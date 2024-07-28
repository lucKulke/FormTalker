import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { supabase } from "@/utils/supabaseCleint";
export function InspectionPlanFolder() {
  const { id } = useParams();

  useEffect(() => {}, []);
  return <div>{id}</div>;
}
