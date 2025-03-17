import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export const useLogin = () => {
  const { login: setLogin } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await login(email, password);
        const { token, data: { attributes: user } } = response;
        setLogin(token, user);
        return user;
      } catch (error: any) {
        console.error('Login error:', error.response || error.message);
        throw error;
      }
    },
  });
};

export const useSignup = () => {
  const { login: setLogin } = useAuth();

  return useMutation({
    mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
      try {
        const response = await signup(username, email, password);
        const { token, data: { attributes: user } } = response;
        setLogin(token, user);
        return user;
      } catch (error: any) {
        console.error('Signup error:', error.response || error.message);
        throw error;
      }
    },
  });
};
