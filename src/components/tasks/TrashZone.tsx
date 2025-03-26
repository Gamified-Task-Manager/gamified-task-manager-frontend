import { useDroppable } from '@dnd-kit/core';

const TrashZone = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-10 p-4 text-center rounded-lg transition-all duration-300 ${
        isOver ? 'bg-red-200 text-red-800 scale-105 shadow-lg' : 'bg-red-100 text-red-600'
      }`}
    >
      🗑️ Drag here to delete task
    </div>
  );
};

export default TrashZone;
