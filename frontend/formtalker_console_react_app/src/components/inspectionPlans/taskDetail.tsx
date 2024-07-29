import { Task, Option } from "./interfaces";

interface TaskProps {
  task: Task;
  onChange: (task: Task) => void;
}

export const TaskDetail: React.FC<TaskProps> = ({ task, onChange }) => {
  const handleOptionChange = (key: string, option: Option) => {
    const updatedOptions = { ...task.options, [key]: option };
    onChange({ ...task, options: updatedOptions });
  };

  const handleAddOption = () => {
    const newKey = String(Object.keys(task.options).length);
    const newOption = { option_name: "", form_input: "" };
    handleOptionChange(newKey, newOption);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <input
        type="text"
        className="block mb-2 p-2 border w-full"
        value={task.taskName}
        onChange={(e) => onChange({ ...task, taskName: e.target.value })}
      />
      {Object.keys(task.options).map((key) => (
        <div key={key} className="mb-2">
          <input
            type="text"
            className="border p-2 w-full mb-1"
            placeholder="Option Name"
            value={task.options[key].option_name}
            onChange={(e) =>
              handleOptionChange(key, {
                ...task.options[key],
                option_name: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Form Input Type"
            value={task.options[key].form_input}
            onChange={(e) =>
              handleOptionChange(key, {
                ...task.options[key],
                form_input: e.target.value,
              })
            }
          />
        </div>
      ))}
      <button
        onClick={handleAddOption}
        className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Option
      </button>
    </div>
  );
};
