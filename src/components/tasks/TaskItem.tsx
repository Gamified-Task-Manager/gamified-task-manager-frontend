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

  const getTaskColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50';
      case 'in_progress':
        return 'bg-blue-50';
      case 'completed':
        return 'bg-green-50';
      default:
        return 'bg-neutral-light';
    }
  };  

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
  className={`transition-all duration-300 ease-in-out opacity-100 hover:scale-[1.01] p-4 rounded-md mb-2 shadow-md ${getTaskColor(task.status)}`}
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
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default TaskItem;
