import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-md"
      >
        {isOpen ? 'Close' : 'Open'}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-gray-800 p-4 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform z-40`}>
        {user ? (
          <>
            <div className="text-white mb-4">Welcome, {user.username}</div>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button onClick={() => console.log('Open Login Modal')}>Login</Button>
            <Button onClick={() => console.log('Open Signup Modal')}>Sign Up</Button>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
