import { useState, useEffect } from 'react';
import { Task } from '../types/interfaces';
import { createTask, updateTask, deleteTask, updateTaskStatus as apiUpdateTaskStatus } from '../services/taskService';
import apiClient from '../services/apiClient';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

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
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/tasks');
        console.log('Fetched tasks:', response.data);
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

    fetchTasks();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 1000); // 👈 1 second
  
      return () => clearTimeout(timer);
    }
  }, [success]);  

  // ✅ Create Task 
  const addTask = async (taskData: Partial<Task>) => {
    setErrors([]);
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      handleError(err);
    }
  };

  //Update Task 
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

  //  Delete Task
  const removeTask = async (taskId: number) => {
    setErrors([]);
    setSuccess(null);
    try {
      const message = await deleteTask(taskId); // we'll return a message from deleteTask
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      console.log(message); // ✅ log it
      setSuccess(message);  // ✅ show it
    } catch (err) {
      handleError(err);
    }
  };

  // Update Task Status 
  const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    setErrors([]);
    try {
      const updatedTask = await apiUpdateTaskStatus(taskId, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      handleError(err);
    }
  };

  return { tasks, addTask, editTask, removeTask, updateTaskStatus, loading, errors, success };
};
