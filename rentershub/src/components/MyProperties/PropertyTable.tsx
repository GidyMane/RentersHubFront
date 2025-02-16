import { Property } from '../../types/dashboard';
import { Edit, Trash2, Home } from 'lucide-react';

interface PropertyTableProps {
  properties: Property[];
  editProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  toggleOccupancy: (id: string) => void;
}

export default function PropertyTable({ 
  properties, 
  editProperty, 
  deleteProperty, 
  toggleOccupancy 
}: PropertyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rent</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{property.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{property.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${property.status === 'Occupied' ? 'bg-green-100 text-green-800' : 
                    property.status === 'Vacant' ? 'bg-red-100 text-red-800' : 
                    property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {property.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">KES {property.monthlyRent}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => editProperty(property.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                  <Edit size={18} />
                </button>
                <button onClick={() => deleteProperty(property.id)} className="text-red-600 hover:text-red-900 mr-2">
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => toggleOccupancy(property.id)} 
                  className={`${property.status === 'Occupied' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                >
                  <Home size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

