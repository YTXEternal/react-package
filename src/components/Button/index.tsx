import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, className, ...props }) => {
  return (
    <button 
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className || ''}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
