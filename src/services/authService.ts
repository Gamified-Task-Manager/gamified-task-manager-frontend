import apiClient from './apiClient';

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/session', { email, password });
  return response.data; // { data: { attributes: { ... } }, token: '...' }
};

export const signup = async (username: string, email: string, password: string) => {
  const response = await apiClient.post('/users', { user: { username, email, password } });
  return response.data; 
};
