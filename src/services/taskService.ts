import apiClient from './apiClient';
import { Task } from '../types/interfaces';

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await apiClient.post('/tasks', { task });
  const data = response.data.data.attributes;
  return {
    ...data,
    id: Number(response.data.data.id), 
  };
};
