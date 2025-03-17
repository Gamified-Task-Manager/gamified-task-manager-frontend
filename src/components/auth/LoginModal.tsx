import { useState } from 'react';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useLogin();

  const handleSubmit = async () => {
    setError(null);
    try {
      await mutateAsync({ email, password });
      onClose(); 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Log In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isPending}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-2"
          disabled={isPending}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
