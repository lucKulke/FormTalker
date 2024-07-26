import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MyComponentProps {
  title: string;
  description: string;
}

const AlertBox: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div className="fixed top-3 left-1/4 right-1/4 z-50">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
};
export default AlertBox;
