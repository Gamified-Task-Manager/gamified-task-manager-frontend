import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskForm from '../components/tasks/TaskForm';
import TrashZone from '../components/tasks/TrashZone';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal'; 
import { useTasks } from '../hooks/useTasks';
import { useMediaQuery } from '../hooks/useMediaQuery';
import useTaskSounds from '../hooks/useTaskSounds';
import { Task } from '../types/interfaces';

const Tasks = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    tasks,
    addTask,
    editTask,
    updateTaskStatus,
    removeTask,
    loading,
    errors,
    success,
  } = useTasks();

  const { playPopSound, playAddSound, playSlotSound, playSwooshSound } = useTaskSounds();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const tasksByStatus = {
    pending: tasks.filter((task) => task.status === 'pending'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedId = event.active.id;
    const draggedTask = tasks.find((task) => task.id!.toString() === draggedId);
    setActiveTask(draggedTask || null);
  };

  const handleDragEnd = ({ active, over }: any) => {
    setActiveTask(null);
    if (!over) return;

    if (over.id === 'trash-zone') {
      playSwooshSound();
      removeTask(Number(active.id));
      return;
    }

    if (active.data.current.column !== over.data.current.column) {
      const from = active.data.current.column;
      const to = over.data.current.column;

      if (to === 'completed') {
        playSlotSound();
      } else {
        playPopSound();
      }

      setTimeout(() => {
        updateTaskStatus(Number(active.id), to);
      }, 100);
    }
  };

  const handleAddTask = async (taskData: Task) => {
    await addTask(taskData);
    playAddSound();
  };

  const handleClearCompleted = () => {
    if (tasksByStatus.completed.length > 0) {
      playSwooshSound();
    }
    tasksByStatus.completed.forEach((task) => {
      removeTask(task.id!);
    });
  };

  console.log('Selected task:', selectedTask);

  return (
    <div className="p-6 md:p-12 bg-neutral-light min-h-screen">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-gold text-center">Your Tasks</h1>
        <p className="text-lg font-sans text-neutral-grey text-center mt-2">
          Keep track of your progress and get things done!
        </p>
      </div>

      {/* Task Form */}
      <div className="max-w-md mx-auto mb-8 bg-white p-4 rounded-lg shadow-md">
        <TaskForm onSubmit={handleAddTask} errors={errors} />
      </div>

      {loading && <p className="text-center">Loading tasks...</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['pending', 'in_progress', 'completed'] as Task['status'][]).map((column) => (
            <SortableContext
              key={column}
              items={tasksByStatus[column].map((task) => task.id!.toString())}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                title={
                  column === 'pending'
                    ? 'To Do'
                    : column === 'in_progress'
                    ? 'In Progress'
                    : 'Completed'
                }
                tasks={tasksByStatus[column]}
                column={column}
                onMoveTask={(id, from, to) => updateTaskStatus(Number(id), to)}
                isMobile={isMobile}
                onClearCompleted={column === 'completed' ? handleClearCompleted : undefined}
                onTaskClick={openTaskModal} // ✅ Add this prop to TaskColumn
              />
            </SortableContext>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <TrashZone />
        </div>

        {success && (
          <p className="text-green-600 text-center mb-4 font-medium transition-opacity duration-300">
            {success}
          </p>
        )}

        <DragOverlay>
          {activeTask && (
            <div className="opacity-80 transition-opacity duration-300 ease-in-out">
              <TaskItem
                task={activeTask}
                onMoveTask={() => {}}
                isMobile={isMobile}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onUpdate={editTask}
        onDelete={removeTask}
        
      />
    </div>
  );
};

export default Tasks;
