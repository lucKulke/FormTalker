import { useEffect, useState } from "react";
import { InspectionPlanFolderCard } from "@/components/inspectionPlanFolders/inspectionPlanFolderCard";
import { Filter } from "@/components/inspectionPlanFolders/filter";
import {
  fetchInspectionPlanFolders,
  addInspectionPlanFolder,
  InspectionPlanFolder,
  AddInspectionPlanFolder,
  updateFolder,
} from "@/services/supabase/inspectionPlanFolders";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigate, useNavigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";
import { IoMdAdd } from "react-icons/io";
import { deleteInspectionPlanFolder } from "@/services/supabase/inspectionPlanFolders";
import { AlertBox } from "@/components/share/alert";
import { AddNewFolderDialog } from "./dialogs/addNewFolder";

export const InspectionPlanFolders: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<InspectionPlanFolder[] | null>(null);
  const [copyOfOriginalFolders, setCopyOfOriginalFolders] = useState<InspectionPlanFolder[] | null>(null)
  const [progress, setProgress] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [startCreatingNewFolder, setStartCreatingNewFolder] =
    useState<boolean>(false);
  const [allAvailableBrands, setAllAvailableBrands] = useState<string[]>([]);
  const [selcetedBrand, setSelectedBrand] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [filterdFolders, setFilterdFolders] = useState<InspectionPlanFolder[] | null>(null)
  
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
  } | null>();
  const addButton = async () => {
    navigate(pageLinks.inspectionPlanFolderCreate);
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
      }
    } catch (err) {
      console.log(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    setProgress(30);
    loadFolders();

    setStartCreatingNewFolder(false);
  }, []);

  useEffect(() => {
    if (folders){
    setAllAvailableBrands(getAllAvailableBrands(folders))}
  }, [folders])

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [alert]);

  const handleDeleteFolder = async (id: string) => {
    if (!folders) return false;
    try {
      const success = await deleteInspectionPlanFolder(id);
      if (success) {
        let copyOfFolders = [...folders];
        copyOfFolders = copyOfFolders.filter((folder) => {
          return folder.id !== id;
        });

        setFolders(copyOfFolders);
        setAlert({
          title: "Delete",
          description: `Successfully delted folder '${id}'`,
        });
      }
    } catch (err) {
      setAlert({
        title: "Delete",
        description: `Deletion attempt of folder '${id}' failed`,
      });
    }
  };

  const handleAddNewFolder = async (
    model: string,
    brand: string,
    hsn: string,
    tsn: string
  ) => {
    try {
      const newFolder: AddInspectionPlanFolder = {
        model: model,
        brand: brand,
        manufacturer_code: hsn,
        type_code: tsn,
      };

      const addedFolders = await addInspectionPlanFolder(newFolder);
      console.log(addedFolders[0]);
      let copyOfFolders = folders ? [...folders] : [];
      addedFolders.forEach((folder) => {
        copyOfFolders.push(folder);
      });
      setFolders(copyOfFolders);
      if (addedFolders.length > 1) {
        setAlert({
          title: "Create",
          description: `Successfully created ${addedFolders.length} new folders`,
        });
      } else {
        setAlert({
          title: "Create",
          description: `Successfully created new folder with id '${addedFolders[0].id}'`,
        });
      }
    } catch (err) {
      setAlert({
        title: "Error",
        description: `Creation attempt of new folder failed`,
      });
    }
  };

  const handleUpdateFolder = async (id: string,
    model: string,
    brand: string,
    hsn: string,
    tsn: string) => {


    const newFolderData = {
      id: id,
      model: model,
      brand: brand,
      manufacturer_code: hsn,
      type_code: tsn,
    };
    const data = await updateFolder(newFolderData)

    if (!data || !folders) return false

    const copyOfFolders = [...folders]
    data.forEach((responseFolder) => {
      let updatedFolder: InspectionPlanFolder = { id: responseFolder.id, created_at: responseFolder.created_at, model: responseFolder.model, brand: responseFolder.brand, manufacturer_code: responseFolder.manufacturer_code, type_code: responseFolder.type_code }
      copyOfFolders.forEach((folder)=>{
        if(folder.id === updatedFolder.id){
          folder.model = updatedFolder.model
          folder.brand = updatedFolder.brand
          folder.manufacturer_code = updatedFolder.manufacturer_code
          folder.type_code = updatedFolder.type_code
        }
      })
    })

    setFolders(copyOfFolders)

    setAlert({title: "Update", description: "Successfully updated Folder"})
  }
  
  function sortByTimestamp(
    a: InspectionPlanFolder,
    b: InspectionPlanFolder
  ): number {
    if (a.created_at < b.created_at) {
      return -1;
    }
    if (a.created_at > b.created_at) {
      return 1;
    }
    return 0;
  }


  function getAllAvailableBrands(folders: InspectionPlanFolder[]): string[] {
    const brands = folders.map((folder)=> {
      return folder.brand
    })
    return Array.from(new Set(brands));

  }

  const handleFilter = (model: string, brand: string) => {
    if(!folders) return null
    const modelRegex = new RegExp(`^${model}.*$`); // Create a dynamic regex
  
  // Filter based on the model using the dynamic regex
  let matchingFolders = folders.filter(folder => modelRegex.test(folder.model));
  console.log(matchingFolders)
  matchingFolders = matchingFolders.filter((folder) => folder.brand === brand)
  setCopyOfOriginalFolders([...folders])
  setFolders(matchingFolders)
  }

  const handleCloseFilter = (): void => {
    setFolders(copyOfOriginalFolders)
  }

  return (
    <>
      {alert && <AlertBox message={alert} />}
      <div className="mt-14">
        <ul className="space-y-8">
          <li className="felx justify-center">
            <div className="w-full">
              <ul className="flex justify-evenly">
                <div></div>
                <li>
                  <Filter onFilter={handleFilter} allAvailableBrands={allAvailableBrands} onCloseFilter={handleCloseFilter} />
                </li>
                <li>
                  <AddNewFolderDialog onSave={handleAddNewFolder}>
                    <Button className="rounded-full">
                      <IoMdAdd className="w-7 h-7" />
                    </Button>
                  </AddNewFolderDialog>
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
                      {folders.sort(sortByTimestamp).map((folder) => (
                        <InspectionPlanFolderCard
                          key={folder.id}
                          model={folder.model}
                          brand={folder.brand}
                          id={folder.id}
                          manufacturerCode={folder.manufacturer_code}
                          typeCode={folder.type_code}
                          onDelete={handleDeleteFolder}
                          onUpdate={handleUpdateFolder}
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
