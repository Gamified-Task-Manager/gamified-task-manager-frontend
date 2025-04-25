import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  username: string;
  token: string;
  points: number; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  updatePoints: () => {}, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, user: User) => {
    const userWithToken = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    setUser(userWithToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        updatePoints, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
