import React, { useState, InputHTMLAttributes } from 'react';
import PasswordToggle from './PasswordToggle';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  rounded?: 'top' | 'bottom' | 'both' | 'none';
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  disabled = false,
  className = '',
  rounded = 'none',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getRoundedClass = () => {
    switch (rounded) {
      case 'top':
        return 'rounded-t-md';
      case 'bottom':
        return 'rounded-b-md';
      case 'both':
        return 'rounded-md';
      default:
        return '';
    }
  };

  const baseClassName = `appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${getRoundedClass()}`;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        className={`${baseClassName} ${className}`.trim()}
        placeholder={placeholder || label}
        disabled={disabled}
        {...props}
      />
      <PasswordToggle
        showPassword={showPassword}
        onToggle={togglePasswordVisibility}
      />
    </div>
  );
}
