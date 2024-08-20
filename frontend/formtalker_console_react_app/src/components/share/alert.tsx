import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertBoxProps {
  message: { title: string; description: string } | null;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ message }) => {
  return (
    <div className="fixed top-5 left-1/4 right-1/4 z-50">
      <Alert className="shadow-xl">
        <Terminal className="h-4 w-4" />
        <AlertTitle>{message ? message.title : "Unknown"}</AlertTitle>
        <AlertDescription>
          {message ? message.description : "Unkonwn"}
        </AlertDescription>
      </Alert>
    </div>
  );
};
