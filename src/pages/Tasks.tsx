const Tasks = () => {
  return (
    <div className="p-4 bg-neutral-light min-h-screen flex justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <h1 className="text-3xl font-serif text-gold mb-4 text-center">
          Your Tasks
        </h1>
        <p className="text-lg font-sans text-neutral-grey mb-8 text-center">
          Here are your tasks. Let's get to work!
        </p>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* "To Do" Column */}
          <div className="bg-neutral-deep p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-serif text-gold mb-2">To Do</h2>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 1
            </div>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 2
            </div>
          </div>

          {/* "In Progress" Column */}
          <div className="bg-neutral-deep p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-serif text-gold mb-2">In Progress</h2>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 3
            </div>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 4
            </div>
          </div>

          {/* "Completed" Column */}
          <div className="bg-neutral-deep p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-serif text-gold mb-2">Completed</h2>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 5
            </div>
            <div className="bg-neutral-light text-neutral-dark p-3 rounded-md mb-2">
              Task 6
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

