import { useState } from 'react';
import { Task } from '../../types/interfaces';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Props {
  onSubmit: (task: Task) => void;
  initialData?: Task;
}

const TaskForm = ({ onSubmit, initialData }: Props) => {
  const [task, setTask] = useState<Task>(
    initialData || {
      name: '',
      description: '',
      status: 'pending',
      priority: 'low',
      dueDate: '',
      notes: '',
      attachmentUrl: '',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.name) return;
    onSubmit(task);
    setTask({
      name: '',
      description: '',
      status: 'pending',
      priority: 'low',
      dueDate: '',
      notes: '',
      attachmentUrl: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        name="name"
        value={task.name}
        onChange={handleChange}
        placeholder="Task Name"
      />
      <Input
        name="description"
        value={task.description || ''}
        onChange={handleChange}
        placeholder="Description"
        className="mt-2"
      />
      <Input
        type="date"
        name="dueDate"
        value={task.dueDate || ''}
        onChange={handleChange}
        className="mt-2"
      />
      <Input
        name="notes"
        value={task.notes || ''}
        onChange={handleChange}
        placeholder="Notes"
        className="mt-2"
      />
      <Input
        name="attachmentUrl"
        value={task.attachmentUrl || ''}
        onChange={handleChange}
        placeholder="Attachment URL"
        className="mt-2"
      />
      <select
        name="status"
        value={task.status}
        onChange={handleChange}
        className="mt-2 border border-neutral-grey p-2 w-full rounded-md"
      >
        <option value="pending">Pending</option>
        <option value="inProgress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select
        name="priority"
        value={task.priority}
        onChange={handleChange}
        className="mt-2 border border-neutral-grey p-2 w-full rounded-md"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="submit" className="mt-4 w-full">
        {initialData ? 'Update Task' : 'Add Task'}
      </Button>
    </form>
  );
};

export default TaskForm;

