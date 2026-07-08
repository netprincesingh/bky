import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  options?: { label: string; value: string }[];
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline,
  options,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {multiline ? (
        <textarea
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...(props as any)}
        />
      ) : options ? (
        <select
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...(props as any)}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...props}
        />
      )}
      
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
