import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  id: string;
  label?: string;
  size?: InputSize;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hideLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      size = 'md',
      error,
      helpText,
      leftIcon,
      rightIcon,
      className = '',
      hideLabel = false,
      ...props
    },
    ref,
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'py-1 px-3 text-sm',
      md: 'py-2 px-3 text-sm',
      lg: 'py-3 px-4 text-base',
    };

    // Padding adjustment for icons
    const paddingLeft = leftIcon ? 'pl-9' : '';
    const paddingRight = rightIcon ? 'pr-9' : '';

    // Error state
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-[var(--card-border)] focus:ring-blue-500 focus:border-transparent';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={`block mb-1 text-sm font-medium text-[var(--text-primary)] ${
              hideLabel ? 'sr-only' : ''
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-secondary)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full rounded-md
              bg-[var(--card-background)]
              text-[var(--text-primary)]
              placeholder:text-[var(--text-secondary)]
              ${paddingLeft} ${paddingRight}
              ${sizeClasses[size]}
              ${errorClasses}
              border
              focus:outline-none focus:ring-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : helpText ? `${id}-description` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--text-secondary)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p
            id={`${id}-description`}
            className="mt-1 text-sm text-[var(--text-secondary)]"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
