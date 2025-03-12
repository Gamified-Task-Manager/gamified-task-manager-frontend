import apiClient from './apiClient';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await apiClient.post('/session', data);
  return response.data;
};

export const signup = async (data: SignupData) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};
