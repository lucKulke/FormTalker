import React from "react";
import { Category } from "./interfaces";

interface FileInputProps {
  onFileLoaded: (data: Category[]) => void;
}

export const FileInput: React.FC<FileInputProps> = ({ onFileLoaded }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        try {
          const data = JSON.parse(contents) as Category[];
          onFileLoaded(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="block p-2 border w-full"
      />
    </div>
  );
};
