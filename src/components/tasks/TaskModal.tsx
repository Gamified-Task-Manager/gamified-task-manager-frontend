import { Dialog } from '@headlessui/react';
import { Task } from '../../types/interfaces';
import { Button } from '../ui/button';
import TaskForm from './TaskForm';
import { useState } from 'react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: number, updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskModal = ({ isOpen, onClose, task, onUpdate, onDelete }: TaskModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const handleSubmit = (updatedTask: Task) => {
    onUpdate(updatedTask.id!, updatedTask); 
    onClose();
    setIsEditing(false);
  };
  

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay that closes the modal on click */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-md w-full rounded-xl shadow-xl p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Task' : task.name}
          </Dialog.Title>

          {isEditing ? (
            <TaskForm initialData={task} onSubmit={handleSubmit} errors={[]} />
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal;
