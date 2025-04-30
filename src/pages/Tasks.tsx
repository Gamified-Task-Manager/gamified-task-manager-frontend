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
import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

import CoinPouch from '../components/shared/CoinPouch';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskForm from '../components/tasks/TaskForm';
import TrashZone from '../components/tasks/TrashZone';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal';
import FloatingCoin from '../components/ui/FloatingCoin';

import { useTasks } from '../hooks/useTasks';
import { useMediaQuery } from '../hooks/useMediaQuery';
import useTaskSounds from '../hooks/useTaskSounds';

import { Task } from '../types/interfaces';

const Tasks = () => {
  // Context
  const { user } = useAuth();

  // States
  const [sortBy, setSortBy] = useState<"due_date" | "priority" | "name" | "">(
    localStorage.getItem("taskSortBy") as "due_date" | "priority" | "name" | "" || ""
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [totalCoins, setTotalCoins] = useState(0);

  const [floatingCoin, setFloatingCoin] = useState<{
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('soundOn');
    return savedPreference ? JSON.parse(savedPreference) : false; // default OFF
  });

  // Refs
  const pouchRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { tasks, addTask, editTask, updateTaskStatus, removeTask, loading, errors, success } = useTasks(sortBy);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { playPopSound, playAddSound, playSlotSound, playSwooshSound } = useTaskSounds(soundOn);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Derived state
  const tasksByStatus = useMemo(() => ({
    pending: tasks.filter(task => task.status === 'pending'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    completed: tasks.filter(task => task.status === 'completed'),
  }), [tasks]);

  // Effects
  useEffect(() => {
    console.log("Current user data after login:", user);
    if (user && typeof user.points === 'number') {
      setTotalCoins(user.points);
    }
  }, [user]); 

  useEffect(() => {
    console.log("Coin pouch totalCoins state:", totalCoins);
  }, [totalCoins]);

  useEffect(() => {
    localStorage.setItem('soundOn', JSON.stringify(soundOn));
  }, [soundOn]);

  // Handlers
  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const triggerCoinAnimation = (taskId: string) => {
    const taskElement = document.getElementById(`task-${taskId}`);
    const pouchElement = pouchRef.current;

    if (taskElement && pouchElement) {
      const taskRect = taskElement.getBoundingClientRect();
      const pouchRect = pouchElement.getBoundingClientRect();

      setFloatingCoin({
        from: { x: taskRect.x, y: taskRect.y },
        to: { x: pouchRect.x, y: pouchRect.y },
      });

      setTimeout(() => setFloatingCoin(null), 2500);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedTask = tasks.find(task => task.id!.toString() === event.active.id);
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
      const to = over.data.current.column;
  
      if (to === 'completed') {
        playSlotSound();
      
        setTimeout(async () => {
          await updateTaskStatus(Number(active.id), to);
          setTimeout(() => triggerCoinAnimation(active.id), 250);
        }, 100);
      } else {
        playPopSound();
        setTimeout(() => updateTaskStatus(Number(active.id), to), 100);
      }
    }
  };

  const handleAddTask = async (taskData: Task) => {
    await addTask(taskData);
    playAddSound();
  };

  const handleClearCompleted = () => {
    if (tasksByStatus.completed.length) playSwooshSound();
    tasksByStatus.completed.forEach(task => removeTask(task.id!));
  };

  
  return (
    <div className="p-6 md:p-12 bg-neutral-light min-h-screen text-neutral-dark font-sans relative">
      {/* Coin Pouch */}
      <div ref={pouchRef} className="absolute top-6 right-6">
        <CoinPouch totalCoins={totalCoins} />
      </div>

      {/* Title Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-serif text-gold mb-2">Your Tasks</h1>
        <p className="text-lg text-neutral-grey">
          Keep track of your progress and earn rewards
        </p>
      </div>

      {/* Task Form */}
      <div className="max-w-md mx-auto mb-10 bg-white p-6 rounded-2xl shadow-lg border border-neutral-grey/20">
        <TaskForm onSubmit={handleAddTask} errors={errors} />
      </div>

      <div className="mb-10 flex flex-col items-center gap-4">
  <div className="flex items-center gap-2">
    <label htmlFor="sortBy" className="text-sm font-medium text-neutral-dark">
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

  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={soundOn}
      onChange={() => setSoundOn(prev => !prev)}
      className="sr-only"
    />
    <span
      className={`relative block w-10 h-6 rounded-full transition-colors ${
        soundOn ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          soundOn ? 'translate-x-4' : ''
        }`}
      />
    </span>
    <span className="ml-3 text-sm font-medium text-neutral-dark">
      {soundOn ? 'Sound On' : 'Sound Off'}
    </span>
  </label>
</div>


      {/* Loading State */}
      {loading && (
        <p className="text-center text-neutral-grey text-sm italic">
          Loading tasks...
        </p>
      )}

      {/* Drag and Drop Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['pending', 'in_progress', 'completed'] as Task['status'][]).map(column => (
            <SortableContext
              key={column}
              items={tasksByStatus[column].map(task => task.id!.toString())}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                title={
                  column === 'pending' ? 'To Do' :
                  column === 'in_progress' ? 'In Progress' : 'Completed'
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
              <TaskItem task={activeTask} onMoveTask={() => {}} isMobile={isMobile} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Floating Coin Animation */}
      {floatingCoin && (
        <FloatingCoin
          from={floatingCoin.from}
          to={floatingCoin.to}
          onComplete={() => setFloatingCoin(null)}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
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
