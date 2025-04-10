import React from 'react';

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  helpText?: string;
  hideLabel?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  helpText,
  hideLabel = false,
  min,
  max,
  step = 1,
  ...props
}) => {
  const increment = () => {
    if (max !== undefined && value + step > max) {
      onChange(max);
    } else {
      onChange(Number((value + step).toFixed(2)));
    }
  };

  const decrement = () => {
    if (min !== undefined && value - step < min) {
      onChange(min);
    } else {
      onChange(Number((value - step).toFixed(2)));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      return;
    }

    if (min !== undefined && newValue < min) {
      onChange(min);
    } else if (max !== undefined && newValue > max) {
      onChange(max);
    } else {
      onChange(newValue);
    }
  };

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
        <input
          id={id}
          type="number"
          value={value}
          onChange={handleInputChange}
          className={`
            w-full rounded-md
            bg-[var(--card-background)]
            text-[var(--text-primary)]
            placeholder:text-[var(--text-secondary)]
            py-2 px-3 pr-16
            text-sm
            ${errorClasses}
            border
            focus:outline-none focus:ring-2
            disabled:cursor-not-allowed disabled:opacity-50
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-description` : undefined
          }
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex">
          <div className="flex flex-col border-l border-[var(--card-border)]">
            <button
              type="button"
              onClick={increment}
              className="flex-1 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)] transition-colors rounded-tr-md"
              disabled={max !== undefined && value >= max}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={decrement}
              className="flex-1 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)] transition-colors rounded-br-md"
              disabled={min !== undefined && value <= min}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
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
};
