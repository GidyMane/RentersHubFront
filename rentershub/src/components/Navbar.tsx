import { Bell, Search, Settings } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-600">Landlord Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Bell className="h-6 w-6" />
          </button>
          <button className="text-green-500 hover:text-green-600">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}

