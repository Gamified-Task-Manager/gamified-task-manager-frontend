//Store and provide user authentication state

import { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  user: { username: string; email: string } | null;
  login: (token: string, user: { username: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    token ? JSON.parse(localStorage.getItem('user') || '{}') : null
  );

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  }, [token, user]);
  const login = (token: string, user: { username: string; email: string }) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};