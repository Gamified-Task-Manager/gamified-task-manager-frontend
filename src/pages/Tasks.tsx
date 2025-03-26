import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskColumn from '../components/tasks/TaskColumn';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Task } from '../types/interfaces';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/tasks/TaskForm'; 
import TrashZone from '../components/tasks/TrashZone';

const Tasks = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { tasks, addTask, updateTaskStatus, removeTask, loading, errors, success } = useTasks(); 

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tasksByStatus = {
    pending: tasks.filter((task) => task.status === 'pending'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  };

  const handleDragEnd = ({ active, over }: any) => {
    if (!over) return;
  
    if (over.id === 'trash-zone') {
      removeTask(Number(active.id));
      return;
    }
  
    if (active.data.current.column !== over.data.current.column) {
      handleMoveTask(active.id, active.data.current.column, over.data.current.column);
    }
  };  

  console.log('Tasks by status:', tasksByStatus); 
  
  const handleMoveTask = (taskId: string, fromColumn: Task['status'], toColumn: Task['status']) => {
    console.log(`Moving task ${taskId} from ${fromColumn} to ${toColumn}`);
    updateTaskStatus(Number(taskId), toColumn);
  };

  const handleAddTask = async (taskData: Task) => {
    await addTask(taskData); 
  };

  return (
    <div className="p-6 md:p-12 bg-neutral-light min-h-screen">
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-gold text-center">Your Tasks</h1>
        <p className="text-lg font-sans text-neutral-grey text-center mt-2">
          Keep track of your progress and get things done!
        </p>
      </div>
  
      {/* Task Form Section */}
      <div className="max-w-md mx-auto mb-8 bg-white p-4 rounded-lg shadow-md">
        <TaskForm onSubmit={handleAddTask} errors={errors} />
      </div>
  
      {loading && <p className="text-center">Loading tasks...</p>}
  
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((task) => task.id!.toString())}
          strategy={verticalListSortingStrategy}
        >
          {/* Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="To Do"
              tasks={tasksByStatus.pending}
              column="pending"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
            <TaskColumn
              title="In Progress"
              tasks={tasksByStatus.in_progress}
              column="in_progress"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
            <TaskColumn
              title="Completed"
              tasks={tasksByStatus.completed}
              column="completed"
              onMoveTask={handleMoveTask}
              isMobile={isMobile}
            />
          </div>
  
          {/* Trash Zone */}
          <div className="flex justify-center mt-10">
            <TrashZone />
          </div>
          {success && (
          <p className="text-green-600 text-center mb-4 font-medium transition-opacity duration-300">
            {success}
           </p>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );  
};

export default Tasks;
