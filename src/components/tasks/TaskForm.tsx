import { useState, useRef, useEffect } from 'react';
import { Task } from '../../types/interfaces';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Props {
  onSubmit: (task: Task) => void;
  initialData?: Task;
  errors?: string[]; // ✅ Accept multiple errors from backend
}

const DEFAULT_TASK: Task = {
  name: '',
  description: '',
  status: 'pending',
  priority: 'low',
  due_date: '',
  notes: '',
  attachment_url: '',
};

const TaskForm = ({ onSubmit, initialData, errors = [] }: Props) => {
  const [task, setTask] = useState<Task>(initialData || DEFAULT_TASK);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    if (errors.length > 0) {
      const timer = setTimeout(() => {
        console.log('Clearing errors...');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTask((prev) => ({ ...prev, attachment_url: reader.result as string }));
        setAttachedFileName(files[0].name);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting task:', task);

    if (!task.name.trim()) {
      console.error('Task name is required');
      return;
    }

    try {
      console.log('Calling onSubmit function...');
      await onSubmit(task);
      console.log('Task submitted successfully');

      setTask(DEFAULT_TASK);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setAttachedFileName(null);
    } catch (err) {
      console.error('Task submission failed:', err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {errors.length > 0 && (
        <div className="text-red-500 text-sm mb-2">
          {errors.map((error, index) => (
            <p key={index}>⚠️ {error}</p>
          ))}
        </div>
      )}

      {/* Task Name */}
      <Input
        name="name"
        value={task.name}
        onChange={handleChange}
        placeholder="Task Name *"
      />

      {/* Description */}
      <Input
        name="description"
        value={task.description || ''}
        onChange={handleChange}
        placeholder="Description"
        className="mt-2"
      />

      {/* Due Date */}
      <div className="mt-2">
        <label className="text-sm text-neutral-grey">Due Date:</label>
        <Input
          type="date"
          name="due_date"
          value={task.due_date || ''}
          onChange={handleChange}
          min={today}
          className="mt-1"
        />
      </div>

      {/* Notes */}
      <Input
        name="notes"
        value={task.notes || ''}
        onChange={handleChange}
        placeholder="Notes"
        className="mt-2"
      />

      {/* Attach File */}
      <div className="mt-2">
        <input
          type="file"
          ref={fileInputRef}
          name="attachment_url"
          onChange={handleChange}
          hidden
        />
        <Button
          type="button"
          variant="outline"
          className="w-full text-sm py-1 px-3 border border-neutral-grey"
          onClick={() => fileInputRef.current?.click()}
        >
          Attach File
        </Button>
        {attachedFileName && (
          <p className="text-sm text-neutral-grey mt-1">
            Attached: {attachedFileName}
          </p>
        )}
      </div>

      {/* Priority Dropdown */}
      <div className="mt-2">
        <label className="text-sm text-neutral-grey">Select Priority:</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="mt-1 border border-neutral-grey px-3 py-2 text-sm w-full rounded-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-500 transition"
      >
        {initialData ? 'Update Task' : 'Add Task'}
      </Button>
    </form>
  );
};

export default TaskForm;
