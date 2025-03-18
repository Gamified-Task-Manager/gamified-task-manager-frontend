import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/interfaces';

interface Props {
  task: Task;
  onMoveTask: (taskId: string, fromColumn: Task['status'], toColumn: Task['status']) => void;
  isMobile: boolean;
}

const TaskItem = ({ task, onMoveTask, isMobile }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id!.toString(),
    data: {
      column: task.status, 
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-neutral-light text-neutral-dark p-4 rounded-md mb-2 shadow-md"
    >
      <div className="font-semibold">{task.name}</div>

      {task.notes && (
        <div className="text-sm text-neutral-grey mt-1">
          Notes: {task.notes}
        </div>
      )}

      {/* Handle mobile dropdown */}
      {isMobile && (
        <select
          value={task.status}
          onChange={(e) =>
            onMoveTask(
              task.id!.toString(), 
              task.status,
              e.target.value as Task['status']
            )
          }
          className="mt-2 border border-neutral-grey p-1 w-full rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default TaskItem;
