import { useDroppable } from '@dnd-kit/core';
import TaskItem from './TaskItem';
import { Task } from '../../types/interfaces';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  column: Task['status'];
  onMoveTask: (taskId: string, fromColumn: Task['status'], toColumn: Task['status']) => void;
  isMobile: boolean;
}

const TaskColumn = ({ title, tasks, column, onMoveTask, isMobile }: TaskColumnProps) => {
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
    </div>
  );
};

export default TaskColumn;
