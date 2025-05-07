import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService'; // 🔄 Update this path if needed

interface User {
  email: string;
  username: string;
  token: string;
  points: number;
  avatar_id?: number;
  theme_id?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
  updateUser: () => Promise<void>; // ✅ New
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  updatePoints: () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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

  const updateUser = async () => {
    try {
      if (!user?.token) return;
      const updated = await getCurrentUser(user.token); // Assumes auth header required
      const updatedUser = { ...updated, token: user.token }; // preserve token
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user:", error);
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
