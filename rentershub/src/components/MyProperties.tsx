"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Property } from '../types/dashboard';

import PropertyTable from './MyProperties/PropertyTable';
import EmptyState from './MyProperties/EmptyState';
import Header from './MyProperties/Header';
import PropertyCard from './MyProperties/PropertyCard';

// Mock data for demonstration
const mockProperties: Property[] = [
  { id: '1', name: 'Greenwood Apartments', location: 'Kilimani, Nairobi', status: 'Occupied', monthlyRent: 22500 },
  { id: '2', name: 'Sunnyvale Condos', location: 'Nderi, Kikuyu', status: 'Vacant', monthlyRent: 18000 },
  { id: '3', name: 'Riverside Townhouses', location: 'Riverside, Kamiti', status: 'Pending', monthlyRent: 26800 },
  { id: '4', name: 'Mountain View Homes', location: 'Landless, Thika', status: 'Approved', monthlyRent: 30007 },
];

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Use useRouter for navigation
  const router = useRouter();

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'All' || property.status === statusFilter)
  );

  const addNewProperty = () => {
    // Navigate to the '/add-property' page
    router.push('/add-property');
  };

  const editProperty = (id: string) => {
    // Placeholder function for editing a property
    console.log('Edit property', id);
  };

  const deleteProperty = (id: string) => {
    // Placeholder function for deleting a property
    setProperties(properties.filter(p => p.id !== id));
  };

  const toggleOccupancy = (id: string) => {
    // Placeholder function for toggling occupancy
    setProperties(properties.map(p => 
      p.id === id ? { ...p, status: p.status === 'Occupied' ? 'Vacant' : 'Occupied' } : p
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Header 
        addNewProperty={addNewProperty}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {filteredProperties.length > 0 ? (
        <>
          <div className="hidden md:block">
            <PropertyTable 
              properties={filteredProperties}
              editProperty={editProperty}
              deleteProperty={deleteProperty}
              toggleOccupancy={toggleOccupancy}
            />
          </div>
          <div className="md:hidden">
            {filteredProperties.map(property => (
              <PropertyCard 
                key={property.id}
                property={property}
                editProperty={editProperty}
                deleteProperty={deleteProperty}
                toggleOccupancy={toggleOccupancy}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
