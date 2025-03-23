import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/shared/Navbar';
import './index.css';
import { useState } from 'react';

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

  console.log("App - isAuthenticated:", isAuthenticated);

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
            <Route path="/tasks" element={<Tasks />} />
          ) : (
            <Route path="/tasks" element={<Navigate to="/" />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
