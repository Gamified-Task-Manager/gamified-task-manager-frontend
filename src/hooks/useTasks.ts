import { useState, useEffect } from 'react';
import { Task } from '../types/interfaces';
import { createTask } from '../services/taskService';
import apiClient from '../services/apiClient';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string, err: unknown) => {
    console.error(message, err);
    setError(message);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/tasks');
        const fetchedTasks = response.data.data.map((task: any) => ({
          id: Number(task.id),
          ...task.attributes,
        }));
        setTasks(fetchedTasks);
      } catch (err) {
        handleError('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      handleError('Failed to create task', err);
    }
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return { tasks, addTask, updateTaskStatus, loading, error };
};
