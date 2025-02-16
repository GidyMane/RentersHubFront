import { Property } from '../../types/dashboard';
import { Edit, Trash2, Home } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  editProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  toggleOccupancy: (id: string) => void;
}

export default function PropertyCard({ 
  property, 
  editProperty, 
  deleteProperty, 
  toggleOccupancy 
}: PropertyCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-green-600 mb-2">{property.name}</h3>
      <p className="text-gray-600 mb-2">{property.location}</p>
      <div className="flex justify-between items-center mb-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
          ${property.status === 'Occupied' ? 'bg-green-100 text-green-800' : 
            property.status === 'Vacant' ? 'bg-red-100 text-red-800' : 
            property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'}`}>
          {property.status}
        </span>
        <span className="font-semibold">${property.monthlyRent}/month</span>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={() => editProperty(property.id)} className="text-blue-600 hover:text-blue-900">
          <Edit size={18} />
        </button>
        <button onClick={() => deleteProperty(property.id)} className="text-red-600 hover:text-red-900">
          <Trash2 size={18} />
        </button>
        <button 
          onClick={() => toggleOccupancy(property.id)} 
          className={`${property.status === 'Occupied' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
        >
          <Home size={18} />
        </button>
      </div>
    </div>
  );
}

