import apiClient from './apiClient';
import { Task } from '../types/interfaces';

// Create Task
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  console.log('Sending task to backend:', task); // Confirm request payload
  try {
    const response = await apiClient.post('/tasks', { task });
    console.log('Create task raw response:', response); // Confirm full response from backend
    
    const data = response.data?.data?.attributes;
    if (!data) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from backend');
    }

    const createdTask = {
      ...data,
      id: Number(response.data.data.id),
    };

    console.log('Created task:', createdTask); // Confirm formatted task
    return createdTask;
  } catch (error: any) {
    console.error('Error creating task:', error); // ✅ Confirm any backend or request error

    //Extract all error messages from the backend response
    if (error.response && error.response.data?.errors) {
      const backendErrors = error.response.data.errors.map((e: any) => e.title);
      console.error('Backend Errors:', backendErrors);

      // Throw all error messages as a single array (or string)
      throw new Error(backendErrors.join('\n'));
    }

    throw new Error('Failed to create task');
  }
};


// Update Task
export const updateTask = async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
  console.log(`Updating task ${taskId} with data:`, taskData);
  const response = await apiClient.patch(`/tasks/${taskId}`, { task: taskData });
  console.log('Update task response:', response.data);
  const data = response.data.data.attributes;
  return {
    ...data,
    id: Number(response.data.data.id), 
  };
};

// Update Task Status (for drag and drop)
export const updateTaskStatus = async (taskId: number, status: Task['status']): Promise<Task> => {
  console.log(`Updating task ${taskId} status to:`, status);
  const response = await apiClient.patch(`/tasks/${taskId}`, { task: { status } });
  console.log('Update task status response:', response.data);
  const data = response.data.data.attributes;
  return {
    ...data,
    id: Number(response.data.data.id), 
  };
};

// Delete Task
export const deleteTask = async (taskId: number): Promise<string> => {
  console.log(`Deleting task ${taskId}`);
  const response = await apiClient.delete(`/tasks/${taskId}`);
  const message = response.data?.message || 'Task deleted successfully';
  console.log(`Task ${taskId} deleted:`, message);
  return message;
};


// Fetch All Tasks (for loading state)
export const fetchTasks = async (): Promise<Task[]> => {
  console.log('Fetching tasks...');
  const response = await apiClient.get('/tasks');
  console.log('Fetched tasks:', response.data);
  return response.data.data.map((task: any) => ({
    id: Number(task.id),
    ...task.attributes,
  }));
};
