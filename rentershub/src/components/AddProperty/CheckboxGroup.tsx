import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
  register: UseFormRegister<any>;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, name, options, register }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`${name}-${option}`}
              value={option}
              {...register(name)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-gray-900">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;

