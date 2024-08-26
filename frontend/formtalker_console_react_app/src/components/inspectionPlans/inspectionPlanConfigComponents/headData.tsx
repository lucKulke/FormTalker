import { fetchSepcificInspectionPlanHeadData } from "@/services/supabase/inspectionPlanHeadData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";

export const HeadData: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<string>("");
  const [millage, setMillage] = useState<number | null>(null);
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const getHeadData = async () => {
    if (id) {
      const response = await fetchSepcificInspectionPlanHeadData(id);
      console.log(response);
      if (!response) return false;
      setType(response[0].inspection_type);
      setMillage(response[0].millage);
      setCreatedFrom(response[0].created_from);
    }
  };
  useEffect(() => {
    getHeadData();
  }, []);
  return (
    <ul className="ml-5">
      <li>
        <Label htmlFor="type">Type</Label>
        <p id="type">{type}</p>
      </li>
      <li>
        <Label htmlFor="millage">Millage</Label>
        <p id="millage">{millage}</p>
      </li>
      <li>
        <Label htmlFor="createdFrom">Created From</Label>
        <p id="createdFrom">{createdFrom}</p>
      </li>
    </ul>
  );
};
