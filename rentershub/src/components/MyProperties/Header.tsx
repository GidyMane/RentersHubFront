import { Plus, Search } from 'lucide-react';

interface HeaderProps {
  addNewProperty: () => void;   
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function Header({ 
  addNewProperty, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-green-600">My Properties</h1>
        <button
          onClick={addNewProperty}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add New Property
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Vacant">Vacant</option>
          <option value="Occupied">Occupied</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
}
