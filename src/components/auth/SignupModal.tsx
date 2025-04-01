import { useState } from "react";
import { useSignup } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
}

const SignupModal = ({ isOpen, onClose, onSignupSuccess }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signup = useSignup();

  const handleSubmit = async () => {
    setError(null);
    try {
      await signup.mutateAsync({ username, email, password });
      onSignupSuccess();
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  // Close modal by clicking outside
  if (!isOpen) return null;

  return (
    <div
  data-testid="signup-modal"
  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  onClick={onClose}
>

      {/* Prevent close when clicking inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-light p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <h2 className="text-2xl font-serif text-gold mb-4">Sign Up</h2>
  
        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
  
        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Inputs */}
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 border border-neutral-grey rounded-md focus:outline-none focus:border-gold"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full px-4 py-3 mt-4 border border-neutral-grey rounded-md focus:outline-none focus:border-gold"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            className="w-full px-4 py-3 mt-4 border border-neutral-grey rounded-md focus:outline-none focus:border-gold"
          />
  
          {/* Buttons */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="bg-gold text-neutral-deep px-6 py-2 rounded-md hover:bg-neutral-grey transition"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default SignupModal;


