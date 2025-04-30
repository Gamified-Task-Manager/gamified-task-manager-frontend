import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/interfaces';

interface Props {
  task: Task;
  onMoveTask: (taskId: string, fromColumn: Task['status'], toColumn: Task['status']) => void;
  isMobile: boolean;
  onClick?: (task: Task) => void;
}

const TaskItem = ({ task, onMoveTask, isMobile, onClick }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id!.toString(),
    data: { column: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isLocked = task.completed === true;

  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
      default:
        return 'bg-neutral-light text-neutral-dark border-neutral-grey/40';
    }
  };

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div
      id={`task-${task.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isLocked && onClick?.(task)}
      className={`
        transition-all duration-300 ease-in-out
        p-4 rounded-lg shadow-sm mb-3 bg-white border border-neutral-grey/20
        cursor-pointer hover:shadow-md hover:scale-[1.01]
        ${isLocked ? 'opacity-60 pointer-events-none' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-medium text-neutral-dark leading-snug">{task.name}</h3>
        <span className="text-xs text-neutral-grey italic flex-shrink-0">
          📅 {formattedDate}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-neutral-dark mt-1">{task.description}</p>
      )}

      {/* Priority Tag */}
      <div className="mt-2">
        <span
          className={`text-xs inline-block px-2 py-0.5 rounded-full border ${getPriorityStyle()}`}
        >
          Priority: {task.priority}
        </span>
      </div>

      {/* Notes Preview */}
      {task.notes && (
        <p className="text-sm text-neutral-grey mt-2 italic line-clamp-2">
          Notes: {task.notes}
        </p>
      )}

      {/* Mobile dropdown */}
      {isMobile && (
        <div onClick={(e) => e.stopPropagation()}>
          <select
          value={task.status}
          onChange={(e) =>
            onMoveTask(
            task.id!.toString(),
            task.status,
            e.target.value as Task['status']
          )
        }
          className="mt-3 border border-neutral-grey px-2 py-1 w-full text-sm rounded-md bg-white focus:outline-none"
          >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    )}
    </div>
  );
};

export default TaskItem;
