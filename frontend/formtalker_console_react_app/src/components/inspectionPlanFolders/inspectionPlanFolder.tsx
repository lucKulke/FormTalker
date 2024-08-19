import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { supabase } from "@/utils/supabaseCleint";
import { MoreHorizontal } from "lucide-react";
import { IoMdAdd } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  InspectionPlanHeadData,
  fetchFolderInspectionPlansHeadData,
  addInspectionPlanHeadData,
  InspectionPlanHeadDataResponse,
  deleteInspectionPlanHeadData,
  updateStatusFromInspectionPlanHeadData,
  updateInspectionPlanHeadData,
} from "@/services/supabase/inspectionPlans";
import { AddInspectionPlanHeadDataDialog } from "@/components/inspectionPlanFolders/dialogs/addInspectionPlanHeadData";
import { getCurrentUser } from "@/services/supabase/auth";
import { AlertBox } from "@/components/share/alert";

import { Input } from "@/components/ui/input";
import { CiSquareCheck } from "react-icons/ci";

interface InspectionPlanFolderProps {
  user: any;
}

export const InspectionPlanFolder: React.FC<InspectionPlanFolderProps> = ({
  user,
}) => {
  const { folderId } = useParams<{ folderId: string }>();

  const [alert, setAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const [inspectionPlansHeadData, setInspectionPlansHeadData] = useState<
    InspectionPlanHeadDataResponse[] | null
  >();
  const [editId, setEditId] = useState<string>("");
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editInspectionType, setEditInspectionType] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editMillage, setEditMillage] = useState<string>("");
  const [millageInputError, setMillageInputError] = useState<boolean>(false);

  const loadInspectionPlans = async () => {
    if (!folderId) return false;
    try {
      const fetchedItems = await fetchFolderInspectionPlansHeadData(folderId);
      console.log(fetchedItems);
      if (fetchedItems) {
        setInspectionPlansHeadData(fetchedItems);
      } else {
        console.log("error");
        setAlert({ title: "Error", description: "No items found" });
      }
    } catch (err) {
      setAlert({
        title: "Error",
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  };
  useEffect(() => {
    if (editId.length !== 0) {
      console.log(editId);
      setOpenEdit(true);
    }
  }, [editId]);

  useEffect(() => {
    loadInspectionPlans();
  }, []);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  }, [alert]);
  const handleAddNewInspectionHead = async (
    inspectionType: string,
    description: string,
    millage: number | null
  ) => {
    if (!folderId) return null;
    const newInspectionPlansHeadData: InspectionPlanHeadData = {
      folder_id: folderId,
      inspection_type: inspectionType,
      description: description,
      millage: millage,
      status: false,
      created_from: user.email,
    };

    const fetchedInspectionPlanHeads = await addInspectionPlanHeadData(
      newInspectionPlansHeadData
    );
    if (fetchedInspectionPlanHeads) {
      let copyOfInspectionPlansHeadData = inspectionPlansHeadData
        ? [...inspectionPlansHeadData]
        : [];

      fetchedInspectionPlanHeads.forEach((HeadData) => {
        copyOfInspectionPlansHeadData.push(HeadData);
      });
      setInspectionPlansHeadData(copyOfInspectionPlansHeadData);
    }
  };

  const handleDeleteInspectionHead = async (id: string) => {
    const isDeleted = await deleteInspectionPlanHeadData(id);
    if (isDeleted && inspectionPlansHeadData) {
      let copyOfInspectionPlansHeadData = [...inspectionPlansHeadData];
      setInspectionPlansHeadData(
        copyOfInspectionPlansHeadData.filter((headData) => {
          return headData.id !== id;
        })
      );
    } else {
    }
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    const newStatus = !status;
    const response = await updateStatusFromInspectionPlanHeadData(
      id,
      newStatus
    );
    if (response && inspectionPlansHeadData) {
      let copyOfInspectionPlansHeadData = [...inspectionPlansHeadData];
      copyOfInspectionPlansHeadData.forEach((headData) => {
        if (headData.id === id) {
          headData.status = newStatus;
        }
      });
      setInspectionPlansHeadData(copyOfInspectionPlansHeadData);
    }
  };

  function isOnlyDigits(str: string) {
    return /^\d+$/.test(str);
  }

  const handleUpdateHeadData = async (
    headDataId: string,
    inspectionType: string,
    description: string,
    millage: string
  ) => {
    if (!inspectionPlansHeadData) return false;

    if (!isOnlyDigits(millage)) {
      setMillageInputError(true);
      return false;
    }

    const newMillageValue = Number(millage);

    const response = await updateInspectionPlanHeadData(
      headDataId,
      inspectionType,
      description,
      newMillageValue
    );

    const copyOfInspectionPlanHeadData = [...inspectionPlansHeadData];
    copyOfInspectionPlanHeadData.forEach((headData) => {
      if (headData.id === headDataId) {
        headData.inspection_type = inspectionType;
        headData.description = description;
        headData.millage = newMillageValue;
      }
    });

    setInspectionPlansHeadData(copyOfInspectionPlanHeadData);
    setOpenEdit(false);
    setEditId("");
    setMillageInputError(false);
    setAlert({
      title: "Update",
      description: "Successfully updated Head Data",
    });
  };

  function sortByTimestamp(
    a: InspectionPlanHeadDataResponse,
    b: InspectionPlanHeadDataResponse
  ) {
    if (a.created_at < b.created_at) {
      return -1;
    }
    if (a.created_at > b.created_at) {
      return 1;
    }
    return 0;
  }

  return (
    <>
      {alert && <AlertBox message={alert} />}
      <div className="container mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inspection Plans</h2>
          <AddInspectionPlanHeadDataDialog onSave={handleAddNewInspectionHead}>
            <Button className="rounded-full">
              <IoMdAdd className="h-7 w-7" />
            </Button>
          </AddInspectionPlanHeadDataDialog>
        </div>
        <div className="overflow-x-auto mt-5">
          <div className="inline-block min-w-full shadow overflow-hidden">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Inspection Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Mileage</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created at</th>
                  <th className="px-4 py-2 text-left">Created from</th>
                </tr>
              </thead>
              <tbody>
                {inspectionPlansHeadData &&
                  inspectionPlansHeadData
                    .sort(sortByTimestamp)
                    .map((inspection) => (
                      <tr
                        key={inspection.id}
                        className="border-t border-gray-200"
                      >
                        <td className="px-4 py-2 text-left">
                          {openEdit && inspection.id === editId ? (
                            <Input
                              id="inspectionType"
                              placeholder="e.g. Millage Inspection"
                              value={editInspectionType}
                              onChange={(e) =>
                                setEditInspectionType(e.target.value)
                              }
                            />
                          ) : (
                            inspection.inspection_type
                          )}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {openEdit && inspection.id === editId ? (
                            <Input
                              id="description"
                              placeholder="test description"
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          ) : (
                            inspection.description
                          )}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {openEdit && inspection.id === editId ? (
                            <Input
                              id="millage"
                              className={millageInputError ? "bg-red-500" : ""}
                              placeholder="e.g. 10000"
                              value={editMillage}
                              onChange={(e) => {
                                setEditMillage(e.target.value);
                              }}
                            />
                          ) : (
                            inspection.millage
                          )}
                        </td>
                        <td className="px-4 py-2 text-left">
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                inspection.id,
                                inspection.status
                              )
                            }
                          >
                            {inspection.status ? (
                              <p className="text-green-500">active</p>
                            ) : (
                              <p className="text-red-500">inactive</p>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-left">
                          {inspection.created_at}
                        </td>
                        <td className="px-4 py-2 text-left">
                          {inspection.created_from}
                        </td>

                        <td className="px-4 py-2 text-left">
                          {openEdit && inspection.id === editId ? (
                            <button
                              onClick={() => {
                                handleUpdateHeadData(
                                  editId,
                                  editInspectionType,
                                  editDescription,
                                  editMillage
                                );
                              }}
                            >
                              <CiSquareCheck className="bg-green-500 h-6 w-6 rounded hover:bg-green-400" />
                            </button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreHorizontal />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditId(inspection.id);
                                    setEditInspectionType(
                                      inspection.inspection_type
                                    );
                                    setEditDescription(inspection.description);
                                    setEditMillage(String(inspection.millage));
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteInspectionHead(inspection.id)
                                  }
                                  className="text-red-500"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
