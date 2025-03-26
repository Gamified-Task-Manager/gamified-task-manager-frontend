import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
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
      setIsAuthenticated(true); // ✅ Ensure state is set properly on page load
    }
  }, []);

  const login = (token: string, user: User) => {
    const userWithToken = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    setUser(userWithToken);
    setIsAuthenticated(true); // ✅ Set authenticated state when logging in
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false); // ✅ Set authenticated state when logging out
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
