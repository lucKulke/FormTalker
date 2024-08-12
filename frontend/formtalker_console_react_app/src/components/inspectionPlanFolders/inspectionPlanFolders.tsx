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
import { supabase } from "@/utils/supabaseCleint";
import { IoMdAdd } from "react-icons/io";

export const InspectionPlanFolders: React.FC = () => {
  const [folders, setFolders] = useState<InspectionPlanFolder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [startCreatingNewFolder, setStartCreatingNewFolder] =
    useState<boolean>(false);

  const addButton = async () => {
    setStartCreatingNewFolder(true);
  };

  const loadFolders = async () => {
    try {
      setProgress(60);
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
  useEffect(() => {
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "folders" },
        (payload) => {
          console.log("Change received!", payload);

          loadFolders();
        }
      )
      .subscribe();

    setLoading(true);
    setProgress(30);
    loadFolders();

    setStartCreatingNewFolder(false);
    return () => {
      // Cleanup subscription on component unmount
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <>
      {startCreatingNewFolder && (
        <Navigate to={pageLinks.inspectionPlanFolderCreate} />
      )}
      <div className="mt-14">
        <ul className="space-y-8">
          <li className="felx justify-center">
            <div className="w-full">
              <ul className="flex justify-evenly">
                <div></div>
                <li>
                  <Filter></Filter>
                </li>
                <li>
                  <Button className="rounded-full" onClick={addButton}>
                    <IoMdAdd className="w-7 h-7" />
                  </Button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex justify-center">
              {loading ? (
                <Progress value={progress} className="mt-[150px] w-[40%]" />
              ) : (
                <>
                  {folders && folders.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {folders.map((folder) => (
                        <InspectionPlanFolderCard
                          key={folder.id}
                          model={folder.model}
                          brand={folder.brand}
                          id={folder.id}
                          manufacturerCode={folder.manufacturer_code}
                          typeCode={folder.type_code}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>No folders</div>
                  )}
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
