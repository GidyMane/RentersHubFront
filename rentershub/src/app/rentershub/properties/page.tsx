'use client'

import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout'
import { FilterBar } from '@/components/Test/Rentershub/FilterBar'
import { PropertyCard } from '@/components/Test/Rentershub/PropertyCard'
import { useState } from 'react'

// This would typically come from an API
const properties = [
  {
    id: 1,
    name: "Ambarukmo Square",
    address: "3650 E Ambarukmo St, Jogja 85032",
    units: 120,
    occupancyRate: 24,
    status: "Active" as const,
    lastUpdated: "Dec 5",
    metrics: {
      views: 9257,
      leads: 45,
      applications: 9
    },
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D98uVzNbCEUloUXSEVyM5YD7KJVsjv.png"
  },
  {
    id: 2,
    name: "The Patang Puluhan",
    address: "2450 B Patangpuluhan St, Jogja 84920",
    units: 53,
    occupancyRate: 38,
    status: "Active" as const,
    lastUpdated: "Nov 29",
    metrics: {
      views: 5340,
      leads: 23,
      applications: 7
    },
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0Jl0ffVryq4VUjIQg5UAQBj73VQzxD.png"
  },
  {
    id: 3,
    name: "The Wetan Kali",
    address: "3235 D Wetan Kali St, Jogja 85018",
    units: 84,
    occupancyRate: 55,
    status: "Off Market" as const,
    lastUpdated: "Nov 27",
    metrics: {
      views: 560,
      leads: 0,
      applications: 0
    },
    imageUrl: "/placeholder.svg?height=400&width=600"
  },
]

export default function PropertiesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [status, setStatus] = useState('all')

  const filteredProperties = properties.filter(property => {
    if (status === 'all') return true
    if (status === 'active') return property.status === 'Active'
    if (status === 'off-market') return property.status === 'Off Market'
    return true
  })

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">My Properties</h1>
          </div>

          <FilterBar
            view={view}
            onViewChange={setView}
            status={status}
            onStatusChange={setStatus}
          />

          <div className={`grid gap-6 ${
            view === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

