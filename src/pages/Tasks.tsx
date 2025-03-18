import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskColumn from '../components/tasks/TaskColumn';
import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Task } from '../types/interfaces';

const Tasks = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [tasks, setTasks] = useState<Record<Task['status'], Task[]>>({
    pending: [
      { id: 1, name: 'Task 1', status: 'pending', priority: 'low' },
      { id: 2, name: 'Task 2', status: 'pending', priority: 'medium' },
    ],
    inProgress: [
      { id: 3, name: 'Task 3', status: 'inProgress', priority: 'high' },
      { id: 4, name: 'Task 4', status: 'inProgress', priority: 'medium' },
    ],
    completed: [
      { id: 5, name: 'Task 5', status: 'completed', priority: 'low' },
    ],
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const fromColumn = active.data.current?.column as Task['status'];
    const toColumn = over.data.current?.column as Task['status'];

    if (fromColumn !== toColumn) {
      handleMoveTask(active.id as string, fromColumn, toColumn);
    }
  };

  const handleMoveTask = (
    taskId: string,
    fromColumn: Task['status'],
    toColumn: Task['status']
  ) => {
    if (fromColumn !== toColumn) {
      setTasks((prev) => {
        const newTasks = { ...prev };
        const taskIndex = newTasks[fromColumn].findIndex(
          (task) => task.id === Number(taskId)
        );

        if (taskIndex !== -1) {
          const [task] = newTasks[fromColumn].splice(taskIndex, 1);
          task.status = toColumn;
          newTasks[toColumn].push(task);
        }

        return newTasks;
      });
    }
  };

  return (
    <div className="p-6 md:p-12 bg-neutral-light min-h-screen">
      {/*Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-gold text-center">
          Your Tasks
        </h1>
        <p className="text-lg font-sans text-neutral-grey text-center mt-2">
          Keep track of your progress and get things done!
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={[
            ...tasks.pending.map((task) => task.id!.toString()),
            ...tasks.inProgress.map((task) => task.id!.toString()),
            ...tasks.completed.map((task) => task.id!.toString()),
          ]}
          strategy={verticalListSortingStrategy}
        >
          {/* Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="To Do"
              tasks={tasks.pending}
              column="pending"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
            <TaskColumn
              title="In Progress"
              tasks={tasks.inProgress}
              column="inProgress"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
            <TaskColumn
              title="Completed"
              tasks={tasks.completed}
              column="completed"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Tasks;
