import { clsx } from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-blue-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-3 rounded-xl',
          'bg-white/5 backdrop-blur-sm',
          'border transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
          'placeholder-blue-300/50 text-white font-medium',
          {
            'border-red-500/50 focus:ring-red-500 focus:border-red-500': error,
            'border-white/20 focus:ring-cyan-500 focus:border-cyan-500 hover:border-white/30': !error,
          },
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-300 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
