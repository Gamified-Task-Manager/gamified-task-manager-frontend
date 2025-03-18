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
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      {user && (
        <Navbar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}
      <div
        className={`transition-all duration-300 ${
          user && isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          {user ? (
            <Route path="/tasks" element={<Tasks />} />
          ) : (
            <Route path="/tasks" element={<Navigate to="/" />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
