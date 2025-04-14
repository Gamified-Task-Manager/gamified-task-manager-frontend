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
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-md w-full rounded-2xl border border-neutral-grey/20 shadow-xl p-6 font-sans text-neutral-dark">
          <Dialog.Title className="text-2xl font-serif text-gold mb-6 text-center">
            {isEditing ? 'Edit Task' : task.name}
          </Dialog.Title>

          {isEditing ? (
            <TaskForm initialData={task} onSubmit={handleSubmit} errors={[]} />
          ) : (
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold">Description:</span> {task.description || '—'}</p>
              <p><span className="font-semibold">Due Date:</span> {task.due_date || '—'}</p>
              <p><span className="font-semibold">Priority:</span> {task.priority || '—'}</p>
              <p><span className="font-semibold">Notes:</span> {task.notes || '—'}</p>

              <div className="mt-6 flex justify-between gap-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gold text-white w-full py-2 hover:bg-yellow-500 transition"
                >
                  ✏️ Edit
                </Button>
                <Button
                  onClick={() => {
                    onDelete(task.id!);
                    onClose();
                  }}
                  className="bg-red-600 text-white w-full py-2 hover:bg-red-500 transition"
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
