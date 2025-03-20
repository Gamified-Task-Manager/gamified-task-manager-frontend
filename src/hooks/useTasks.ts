import { useState, useEffect } from 'react';
import { Task } from '../types/interfaces';
import { createTask } from '../services/taskService';
import apiClient from '../services/apiClient';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/tasks');
        console.log('Fetched tasks:', response.data); // EMPORARY LOG
        const fetchedTasks = response.data.data.map((task: any) => ({
          id: Number(task.id),
          ...task.attributes,
        }));
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err); // LOG ERROR CLEARLY
        setError('Failed to load tasks');
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
      setError('Failed to create task');
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
