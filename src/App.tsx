import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Rewards from './pages/Rewards'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import './index.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  console.log("App - isAuthenticated:", isAuthenticated);

  useEffect(() => {
    if (location.pathname === '/tasks') {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ✅ Show Navbar ONLY when authenticated */}
      {isAuthenticated && (
        <Navbar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}
      <div
        className={`transition-all duration-300 ${
          isAuthenticated && isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />

          {isAuthenticated ? (
          <>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/rewards" element={<Rewards />} />
          </>
          ) : (
          <>
        <Route path="/tasks" element={<Navigate to="/" />} />
        <Route path="/rewards" element={<Navigate to="/" />} />
          </>
      )}

  <Route path="*" element={<Navigate to="/" />} />
</Routes>

      </div>
    </>
  );
}
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

export default App;
