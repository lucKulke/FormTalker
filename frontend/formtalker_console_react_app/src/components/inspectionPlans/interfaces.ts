export interface CheckboxFields {
  [key: string]: string; // Key is a string, value is a description
}

// Represents individual options for the text input type
export interface TextFields {
  [key: string]: string; // Key is a string, value is a description or label
}

// Represents the structure of checkbox and text inputs in each category
export interface InputTypeStructure {
  tasks: string[]; // List of tasks associated with this input type
  fields: CheckboxFields; // Fields with options for checkbox input type
  indevidual: CheckboxFields; // Individual options for text input type
}

// Represents a category with different input types
export interface CategoryStructure {
  [taskName: string]: {
    checkbox: InputTypeStructure;
    text: TextFields;
  };
}

// Represents the overall structure of the JSON data
export interface InspectionPlanData {
  [categoryName: string]: CategoryStructure;
}

export interface RawData {
  [categoryName: string]: {
    [taskName: string]: {
      checkbox: {
        tasks?: string[];
        fields?: CheckboxFields;
        indevidual?: CheckboxFields;
      };
      text?: TextFields;
    };
  };
}
