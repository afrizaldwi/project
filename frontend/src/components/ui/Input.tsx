import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
          error ? "border-red-500" : "border-gray-200 focus:border-primary"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
