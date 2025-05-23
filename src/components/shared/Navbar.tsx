"use client";

import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const Navbar = ({ isOpen, onToggle }: Props) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide Navbar if user is on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Hamburger Icon */}
      {user && (
        <Button
        onClick={onToggle}
        size="icon"
        variant="secondary"
        className="fixed top-4 left-4 z-50 bg-neutral-deep/50 border border-gold text-gold hover:bg-neutral-deep hover:border-gold transition backdrop-blur-sm text-2xl p-2"
      >
        {isOpen ? "✕" : "☰"}
      </Button>
      )}
  
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
  
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-deep/90 backdrop-blur-sm border-r border-gold p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform z-40 shadow-lg`}
      >
        <div className="flex flex-col gap-6 mt-16">
  {user && (
    <div className="text-gold text-lg font-serif">
      Good to see you, {user.username}!
    </div>
  )}

  {user && (
    <div className="text-gold text-md font-semibold flex items-center gap-2 animate-fade-in">
      💰 <span>{user.points} Task Bucks</span>
    </div>
  )}

  {/* Tasks Link */}
  {user && (
    <Link
      to="/tasks"
      className="text-gold font-medium hover:underline transition text-md"
    >
      View Tasks
    </Link>
  )}

  {/* Rewards Link */}
  {user && (
    <Link
      to="/rewards"
      className="text-gold font-medium hover:underline transition text-md"
    >
      Go to Rewards
    </Link>
  )}

  {user && (
    <Button
      onClick={logout}
      variant="destructive"
      className="w-full bg-transparent border border-gold text-gold hover:bg-gold hover:text-neutral-deep transition"
    >
      Logout
    </Button>
  )}
</div>

      </div>
    </>
  );
  
};

export default Navbar;
