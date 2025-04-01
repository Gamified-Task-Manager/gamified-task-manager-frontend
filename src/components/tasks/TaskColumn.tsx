import { useDroppable } from '@dnd-kit/core';
import TaskItem from './TaskItem';
import { Task } from '../../types/interfaces';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  column: Task['status'];
  onMoveTask: (taskId: string, fromColumn: Task['status'], toColumn: Task['status']) => void;
  isMobile: boolean;
  onClearCompleted?: () => void;
  onTaskClick?: (task: Task) => void; // ✅ Add this
}

const columnColor = (column: Task['status']) => {
  switch (column) {
    case 'pending':
      return 'bg-yellow-100';
    case 'in_progress':
      return 'bg-blue-100';
    case 'completed':
      return 'bg-green-100';
    default:
      return 'bg-neutral-deep';
  }
};

const TaskColumn = ({
  title,
  tasks,
  column,
  onMoveTask,
  isMobile,
  onClearCompleted,
  onTaskClick, // ✅ Destructure it
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
    data: { column },
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg shadow-md min-h-[200px] transition-all duration-300 ${
        isOver ? 'ring-2 ring-gold/50 scale-[1.01]' : ''
      } ${columnColor(column)}`}
    >
      <h2 className="text-xl font-serif text-gold mb-2">{title}</h2>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onMoveTask={onMoveTask}
          isMobile={isMobile}
          onClick={() => onTaskClick?.(task)} // ✅ Call handler if provided
        />
      ))}

      {column === 'completed' && onClearCompleted && tasks.length > 0 && (
        <button
          onClick={() => {
            const confirmed = window.confirm('Are you sure you want to delete all completed tasks?');
            if (confirmed) onClearCompleted();
          }}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default TaskColumn;
