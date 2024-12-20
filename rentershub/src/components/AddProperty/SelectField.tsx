import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
  register: UseFormRegister<any>;
  required?: boolean;
  error?: FieldError;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  register,
  required = false,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        {...register(name, { required })}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default SelectField;

