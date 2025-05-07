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
  onTaskClick?: (task: Task) => void;
}

const TaskColumn = ({
  title,
  tasks,
  column,
  onMoveTask,
  isMobile,
  onClearCompleted,
  onTaskClick,
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
    data: { column },
  });

  return (
    <div
      ref={setNodeRef}
      data-testid={`${column}-column`}
      className={`
        bg-white
        rounded-xl
        border border-neutral-grey/20
        shadow-sm
        p-5
        min-h-[200px]
        transition-all duration-300
        ${isOver ? 'ring-2 ring-gold/50 scale-[1.01]' : ''}
      `}
    >
      <h2 className="text-xl font-serif text-gold mb-4">{title}</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onMoveTask={onMoveTask}
            isMobile={isMobile}
            onClick={() => onTaskClick?.(task)}
          />
        ))}
      </div>

      {column === 'completed' && onClearCompleted && tasks.length > 0 && (
        <button
          onClick={() => {
            const confirmed = window.confirm('Are you sure you want to delete all completed tasks?');
            if (confirmed) onClearCompleted();
          }}
          className="mt-6 text-sm text-red-600 hover:underline"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default TaskColumn;
