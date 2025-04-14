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
import { useState, useMemo } from 'react';
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
  const [sortBy, setSortBy] = useState<"due_date" | "priority" | "name" | "">(() => {
    return localStorage.getItem("taskSortBy") as "due_date" | "priority" | "name" | "" || "";
  });

  const {
    tasks,
    addTask,
    editTask,
    updateTaskStatus,
    removeTask,
    loading,
    errors,
    success,
  } = useTasks(sortBy);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const { playPopSound, playAddSound, playSlotSound, playSwooshSound } = useTaskSounds();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Lifted state

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);        //Auto-open in edit mode
    setIsModalOpen(true);
  };

  const tasksByStatus = useMemo(() => ({
    pending: tasks.filter((task) => task.status === 'pending'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  }), [tasks]);

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

  return (
    <div className="p-6 md:p-12 bg-neutral-light min-h-screen text-neutral-dark font-sans">
      {/* Title Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-serif text-gold mb-2">Your Tasks</h1>
        <p className="text-lg text-neutral-grey">Keep track of your progress and get things done</p>
      </div>

      {/* Task Form */}
      <div className="max-w-md mx-auto mb-10 bg-white p-6 rounded-2xl shadow-lg border border-neutral-grey/20">
        <TaskForm onSubmit={handleAddTask} errors={errors} />
      </div>

      {/* Sort Dropdown */}
      <div className="mb-10 text-center">
        <label htmlFor="sortBy" className="mr-3 text-sm font-medium text-neutral-dark">
          Sort tasks by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => {
            const selected = e.target.value as "due_date" | "priority" | "name" | "";
            setSortBy(selected);
            localStorage.setItem("taskSortBy", selected);
          }}
          className="px-3 py-2 text-sm rounded-md border border-neutral-grey bg-white shadow-sm focus:outline-none"
        >
          <option value="">Default</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-neutral-grey text-sm italic">Loading tasks...</p>
      )}

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                onTaskClick={openTaskModal}
              />
            </SortableContext>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <TrashZone />
        </div>

        {success && (
          <p className="text-green-600 text-center mt-8 font-medium transition-opacity duration-300">
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
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false); //reset editing mode on close
        }}
        task={selectedTask}
        onUpdate={editTask}
        onDelete={removeTask}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
};

export default Tasks;
