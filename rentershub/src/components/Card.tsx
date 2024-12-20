import { ReactNode } from 'react'

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
  accentColor: string;
}

export default function Card({ title, value, icon, accentColor }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${accentColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`text-${accentColor.replace('border-', '')} opacity-75`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

