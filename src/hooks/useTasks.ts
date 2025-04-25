import { useState, useEffect } from 'react';
import { Task } from '../types/interfaces';
import {
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus as apiUpdateTaskStatus,
} from '../services/taskService';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

export const useTasks = (sortBy?: "due_date" | "priority" | "name" | "") => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const { updatePoints } = useAuth();

  const handleError = (err: any) => {
    console.error('Backend Error:', err);

    if (err.response?.data?.errors) {
      // Set multiple backend errors into the state
      setErrors(err.response.data.errors.map((e: any) => e.title));
    } else if (err.message) {
      setErrors([err.message]);
    } else {
      setErrors(['An unknown error occurred.']);
    }
  };

  useEffect(() => {
    console.log("Fetching tasks with sortBy:", sortBy);
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/tasks', {
          params: sortBy ? { sort_by: sortBy } : {},
        });
        const fetchedTasks = response.data.data.map((task: any) => ({
          id: Number(task.id),
          ...task.attributes,
        }));
        setTasks(fetchedTasks);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user?.token) {
      fetchTasks();
    }
  }, [sortBy]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  // Create Task
  const addTask = async (taskData: Partial<Task>) => {
    setErrors([]);
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      handleError(err);
    }
  };

  // Update Task
  const editTask = async (taskId: number, taskData: Partial<Task>) => {
    setErrors([]);
    try {
      const updatedTask = await updateTask(taskId, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      handleError(err);
    }
  };

  // Delete Task
  const removeTask = async (taskId: number) => {
    setErrors([]);
    setSuccess(null);
    try {
      const message = await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log(message);
      setSuccess(message);
    } catch (err) {
      handleError(err);
    }
  };

  // ✅ Update Task Status and Handle Points
  const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    setErrors([]);
    try {
      const { task, newPoints } = await apiUpdateTaskStatus(taskId, status);

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, status } : t))
      );

      if (newPoints !== undefined) {
        updatePoints(newPoints); // update context
      }

      return task;
    } catch (err) {
      handleError(err);
    }
  };

  return {
    tasks,
    addTask,
    editTask,
    removeTask,
    updateTaskStatus,
    loading,
    errors,
    success,
  };
};
