import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/auth/LoginModal"; 
import SignupModal from "../components/auth/SignupModal";

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const navigate = useNavigate(); // Updated to useNavigate

  const { setIsAuthenticated } = useAuth();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); 
    setIsLoginOpen(false);
    navigate("/tasks"); // Redirect to tasks after login
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    setIsSignupOpen(false);
    navigate("/tasks"); // Redirect to tasks after signup
  };

  return (
    <div className="p-8 bg-neutral-light min-h-screen flex flex-col items-center justify-center">
      {/* Heading */}
      <h1 className="text-4xl font-serif text-gold mb-4">
        Welcome to the App!
      </h1>

      {/* Description */}
      <p className="text-lg font-sans text-neutral-grey mb-8">
        Login or sign up to get started.
      </p>

      {/* CTA Buttons */}
      <div className="space-x-4">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="bg-gold text-neutral-deep px-6 py-2 rounded-md hover:bg-neutral-grey transition"
        >
          Login
        </button>
        <button
          onClick={() => setIsSignupOpen(true)}
          className="border border-neutral-grey text-neutral-dark px-6 py-2 rounded-md hover:border-gold hover:text-gold transition"
        >
          Sign Up
        </button>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignupSuccess={handleSignupSuccess}
      />
    </div>
  );
};

export default Home;