import { useState } from "react";
import { InspectionPlanData, RawData } from "./interfaces";
import { Sidebar } from "@/components/inspectionPlans/sideBar";
import { TaskDetail } from "@/components/inspectionPlans/taskDetail";
import { FileInput } from "@/components/inspectionPlans/fileInput";

const transformData = (data: RawData): InspectionPlanData => {
  const inspectionPlanData: InspectionPlanData = {};

  for (const [categoryName, tasks] of Object.entries(data)) {
    inspectionPlanData[categoryName] = {};

    for (const [taskName, taskDetails] of Object.entries(tasks)) {
      inspectionPlanData[categoryName][taskName] = {
        checkbox: {
          tasks: taskDetails.checkbox?.tasks || [],
          fields: taskDetails.checkbox?.fields || {},
          indevidual: taskDetails.checkbox?.indevidual || {},
        },
        text: taskDetails.text || {},
      };
    }
  }

  return inspectionPlanData;
};

const exampleData = {
  "Elektrik und elektronische Fahrzeugsysteme": {
    Frontbeleuchtung: {
      checkbox: {
        tasks: ["standlicht prüfen", "Abblendlicht prüfen", "Fernlicht prüfen"],
        fields: {
          "3": "in ordnung",
          "4": "nicht in ordnung",
          "5": "behoben",
        },
        indevidual: {},
      },
      text: {},
    },
    Heckbeleuchtung: {
      checkbox: {
        tasks: [
          "Bremslicht prüfen",
          "Rücklichter prüfen",
          "Kennzeichenbeleuchtung prüfen",
        ],
        fields: {
          "6": "in ordnung",
          "7": "nicht in ordnung",
          "8": "behoben",
        },
        indevidual: {},
      },
      text: {},
    },
  },
  Bereifung: {
    Reifenart: {
      checkbox: {
        tasks: ["Reifenart prüfen"],
        fields: {
          "3": "in ordnung",
          "4": "nicht in ordnung",
          "5": "behoben",
        },
        indevidual: {
          "7": "Sommerreifen",
          "8": "Winterreifen",
        },
      },
      text: {
        "3": "Reifen größe",
      },
    },
  },
};

const transformedData = transformData(exampleData);
console.log(transformedData);

export const InspectionPlan: React.FC = () => {
  const [data, setData] = useState<InspectionPlanData>(transformedData);
  console.log(Object.keys(data));
  return (
    <>
      <Sidebar categories={Object.keys(data)}></Sidebar>
    </>
  );
};
