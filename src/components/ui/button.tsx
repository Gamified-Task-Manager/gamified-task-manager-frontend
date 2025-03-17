import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 font-semibold rounded-md shadow-sm transition-all duration-150 ease-in-out',
          variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-100',
          variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600',
          variant === 'default' && 'bg-blue-500 text-white hover:bg-blue-600',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
