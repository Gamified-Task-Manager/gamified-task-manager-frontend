"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import LoginModal from "../auth/LoginModal";
import SignupModal from "../auth/SignupModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
    setIsOpen(false); // Close sidebar when opening modal
  };

  const handleOpenSignup = () => {
    setIsSignupOpen(true);
    setIsOpen(false); // Close sidebar when opening modal
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant="secondary"
        className="fixed top-4 right-4 z-50"
      >
        {isOpen ? "✕" : "☰"}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 p-6 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform z-40 shadow-lg`}
      >
        {/* Close Button */}
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4"
        >
          ✕
        </Button>

        <div className="flex flex-col gap-4 mt-16">
          {user ? (
            <>
              <div className="text-white text-lg font-medium">
                Welcome, {user.username}!
              </div>
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleOpenLogin}
                variant="outline"
                className="w-full"
              >
                Login
              </Button>
              <Button
                onClick={handleOpenSignup}
                variant="default"
                className="w-full"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </>
  );
};

export default Navbar;
