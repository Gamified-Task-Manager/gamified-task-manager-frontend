//handle authentication by providing reusable functions to manage the user login and signup
// authService.ts


import apiClient from './apiClient';

interface AuthResponse {
  token: string;
  data: {
    attributes: {
      username: string;
      email: string;
    };
  };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/session', {
    email,
    password
  });
  return data;
};

export const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/users', {
    username,
    email,
    password
  });
  return data;
};
