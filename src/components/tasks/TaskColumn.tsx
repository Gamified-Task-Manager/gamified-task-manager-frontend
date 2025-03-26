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
}

const TaskColumn = ({ title, tasks, column, onMoveTask, isMobile, onClearCompleted }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column, 
    data: { column },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-neutral-deep p-4 rounded-lg shadow-md min-h-[200px]"
    >
      <h2 className="text-xl font-serif text-gold mb-2">{title}</h2>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onMoveTask={onMoveTask}
          isMobile={isMobile}
        />
      ))}
      {column === 'completed' && onClearCompleted && tasks.length > 0 && (
        <button onClick={() => {
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
