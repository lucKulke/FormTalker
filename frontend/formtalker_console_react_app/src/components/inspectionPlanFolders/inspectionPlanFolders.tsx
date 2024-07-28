import { useEffect, useState } from "react";
import { InspectionPlanFolderCard } from "@/components/inspectionPlanFolders/inspectionPlanFolderCard";
import { Filter } from "@/components/inspectionPlanFolders/filter";
import {
  fetchInspectionPlanFolders,
  addInspectionPlanFolder,
  InspectionPlanFolder,
} from "@/services/supabase/inspectionPlanFolders";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";

export function InspectionPlanFolders() {
  const [folders, setFolders] = useState<InspectionPlanFolder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [startCreatingNewFolder, setStartCreatingNewFolder] =
    useState<boolean>(false);

  const addButton = async () => {
    setStartCreatingNewFolder(true);
  };

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const fetchedFolders = await fetchInspectionPlanFolders();
        setProgress(90);
        if (fetchedFolders) {
          setFolders(fetchedFolders);

          setLoading(false);
        } else {
          console.log("error");
          setError("No folders found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };
    setLoading(true);
    setProgress(30);
    loadFolders();

    setStartCreatingNewFolder(false);
  }, []);

  return (
    <>
      {startCreatingNewFolder && (
        <Navigate to={pageLinks.inspectionPlanFolderCreate} />
      )}
      <div className="mt-7">
        <ul className="space-y-6">
          <li>
            <div className="flex justify-center">
              <Button onClick={addButton}>Add</Button>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              <Filter></Filter>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              {loading && (
                <Progress value={progress} className="mt-[150px] w-[40%]" />
              )}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {folders && folders.length > 0 ? (
                  folders.map((folder, index) => (
                    <InspectionPlanFolderCard
                      key={index}
                      carName={folder.car_name}
                      brand={folder.brand}
                      id={folder.id}
                      manufacturerCode={folder.manufacturer_code}
                      typeCode={folder.type_code}
                    />
                  ))
                ) : (
                  <div>No folders</div>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
