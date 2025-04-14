import { Dialog } from '@headlessui/react';
import { Task } from '../../types/interfaces';
import { Button } from '../ui/button';
import TaskForm from './TaskForm';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskId: number, updatedTask: Task) => void;
  onDelete: (taskId: number) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
}

const TaskModal = ({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing,
}: TaskModalProps) => {
  if (!task) return null;

  const handleSubmit = (updatedTask: Task) => {
    onUpdate(updatedTask.id!, updatedTask);
    onClose();
    setIsEditing(false);
  };

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <Dialog open={isOpen} onClose={() => {
      onClose();
      setIsEditing(false);
    }} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-md w-full rounded-2xl border border-neutral-grey/20 shadow-xl p-6 font-sans text-neutral-dark">
          <Dialog.Title className="text-2xl font-serif text-gold mb-6 text-center">
            {isEditing ? 'Edit Task' : task.name}
          </Dialog.Title>

          {isEditing ? (
            <TaskForm initialData={task} onSubmit={handleSubmit} errors={[]} />
          ) : (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p><span className="font-semibold">Description:</span> {task.description || '—'}</p>
                <p><span className="font-semibold">Due Date:</span> {formattedDate}</p>
                <p><span className="font-semibold">Priority:</span> {task.priority}</p>
                {task.notes && (
                  <p className="italic text-neutral-grey">
                    Notes: {task.notes}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                {/* ✏️ Sleek Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 px-4 bg-neutral-dark text-white py-2 w-full rounded-md hover:bg-gold/90 hover:text-neutral-deep transition"
                >
                  ✏️ Edit Task
                </button>

                {/* 🗑️ Subtle Delete Button */}
                <button
                  onClick={() => {
                    onDelete(task.id!);
                    onClose();
                    setIsEditing(false);
                  }}
                  className="text-xs text-neutral-grey hover:text-red-500 hover:underline transition"
                >
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TaskModal;
