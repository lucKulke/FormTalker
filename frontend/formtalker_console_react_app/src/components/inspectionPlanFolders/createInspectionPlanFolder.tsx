import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigate } from "react-router-dom";
import { pageLinks } from "@/utils/pageLinks";
import {
  AddInspectionPlanFolder,
  addInspectionPlanFolder,
} from "@/services/supabase/inspectionPlanFolders";
import AlertBox from "@/components/share/alert";
import { NewInspectionPlanFolderCard } from "@/components/inspectionPlanFolders/newInspectionPlanFolderCard";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export const CreateInspectionPlanFolder: React.FC = () => {
  const navigate = useNavigate();
  const [canceld, setCanceld] = useState<boolean>(false);
  const [model, setCarName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [hsn, setHsn] = useState<string>("");
  const [tsn, setTsn] = useState<string>("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [successfullyCreatedNewFolder, setSuccessfullyCreatedNewFolder] =
    useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  const handleCreate = async () => {
    const newFolderData: AddInspectionPlanFolder = {
      model: model,
      brand: brand,
      manufacturer_code: hsn,
      type_code: tsn,
    };
    const response = await addInspectionPlanFolder(newFolderData);
    setFolderId(response[0].id);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 5000);
    setSuccessfullyCreatedNewFolder(true);
  };

  return (
    <>
      {successfullyCreatedNewFolder && (
        <>
          {alert && (
            <AlertBox
              title="New Folder"
              description={`New Folder with car name ${model} was created succesfully!`}
            />
          )}
          <Dialog
            open={successfullyCreatedNewFolder}
            onOpenChange={setSuccessfullyCreatedNewFolder}
          >
            <DialogContent className="sm:max-w-[425px] ">
              <DialogHeader className="mt-5">
                <DialogTitle>
                  Do you want to add your first Inspection Plan?
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <ul className="flex justify-evenly mt-5">
                <li>
                  <Button
                    variant="outline"
                    type="submit"
                    onClick={() => {
                      navigate(pageLinks.inspectionPlanFolders);
                    }}
                  >
                    No
                  </Button>
                </li>
                <li>
                  <Button
                    type="submit"
                    onClick={() => {
                      navigate(pageLinks.inspectionPlanFolder + `${folderId}`);
                    }}
                  >
                    Yes
                  </Button>
                </li>
              </ul>
            </DialogContent>
          </Dialog>
        </>
      )}

      <NewInspectionPlanFolderCard
        model={model}
        setCarName={setCarName}
        brand={brand}
        setBrand={setBrand}
        hsn={hsn}
        setHsn={setHsn}
        tsn={tsn}
        setTsn={setTsn}
        handleCreate={handleCreate}
      />
    </>
  );
};
