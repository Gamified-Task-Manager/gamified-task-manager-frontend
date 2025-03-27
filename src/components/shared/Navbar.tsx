"use client";

import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

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
          className="fixed top-4 left-4 z-50 bg-neutral-deep text-gold hover:bg-neutral-dark"
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
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-deep p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform z-40 shadow-lg`}
      >
        <div className="flex flex-col gap-6 mt-16">
          {/* Welcome Message */}
          {user && (
            <div className="text-gold text-lg font-serif">
              Welcome, {user.username}!
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full bg-gold text-neutral-deep hover:bg-neutral-grey"
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
