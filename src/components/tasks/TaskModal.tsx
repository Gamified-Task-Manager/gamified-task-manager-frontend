// src/components/tasks/TaskModal.tsx
import { useState } from 'react';
import { Task } from '../../types/interfaces';
import { Dialog } from '@headlessui/react'; 
import TaskForm from './TaskForm';
import { Button } from '../ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: number, updatedTask: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
}

const TaskModal = ({ isOpen, onClose, task, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const handleSubmit = (updatedTask: Task) => {
    onUpdate(task.id!, updatedTask);
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Task' : task.name}
          </h2>
  
          {isEditing ? (
            <TaskForm
              initialData={task}
              onSubmit={handleSubmit}
              errors={[]}
            />
          ) : (
            <div className="space-y-2 text-sm text-neutral-dark">
              <p><strong>Description:</strong> {task.description || '—'}</p>
              <p><strong>Due Date:</strong> {task.due_date || '—'}</p>
              <p><strong>Priority:</strong> {task.priority || '—'}</p>
              <p><strong>Notes:</strong> {task.notes || '—'}</p>
  
              <div className="mt-4 flex justify-between gap-2">
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white">
                  ✏️ Edit
                </Button>
                <Button
                  onClick={() => {
                    onDelete(task.id!);
                    onClose();
                  }}
                  className="bg-red-600 text-white"
                >
                  🗑️ Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );  
};

export default TaskModal;
