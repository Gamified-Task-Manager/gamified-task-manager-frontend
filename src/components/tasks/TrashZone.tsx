import { useDroppable } from '@dnd-kit/core';

const TrashZone = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        mt-10 w-full max-w-xs mx-auto
        text-center font-sans text-sm
        px-6 py-4 rounded-xl border transition-all duration-300
        ${isOver
          ? 'bg-red-100 text-red-800 border-red-400 shadow-md scale-[1.03]'
          : 'bg-red-50 text-red-500 border-red-100'}
      `}
    >
      🗑️ Drag here to delete task
    </div>
  );
};

export default TrashZone;
