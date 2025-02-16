import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  register,
  required = false,
  type = 'text',
  placeholder,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        {...register(name, { required })}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;

