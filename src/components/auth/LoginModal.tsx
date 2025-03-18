import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useLogin();

  const handleSubmit = async () => {
    setError(null);
    try {
      await mutateAsync({ email, password });
      onLoginSuccess();
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  // Close modal by clicking outside
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      {/* Prevent close when clicking inside the modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-light p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <h2 className="text-2xl font-serif text-gold mb-4">Log In</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Inputs */}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 border border-neutral-grey rounded-md focus:outline-none focus:border-gold"
          disabled={isPending}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 mt-4 border border-neutral-grey rounded-md focus:outline-none focus:border-gold"
          disabled={isPending}
        />

        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-gold text-neutral-deep px-6 py-2 rounded-md hover:bg-neutral-grey transition"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
