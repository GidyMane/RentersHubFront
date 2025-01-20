'use client'

import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout'
import { FilterBar } from '@/components/Test/Rentershub/FilterBar'
import { PropertyCard } from '@/components/Test/Rentershub/PropertyCard'
import { useState } from 'react'

// Updated properties for Kenyan market
const properties = [
  {
    id: 1,
    name: "The Kilimani Haven",
    address: "123 Kilimani Rd, Nairobi",
    units: 45,
    occupancyRate: 80,
    status: "Active" as const,
    lastUpdated: "Jan 12",
    metrics: {
      views: 1200,
      leads: 50,
      applications: 15
    },
    imageUrl: "/kilimani.jpg"
  },
  {
    id: 2,
    name: "Roysa Apartments",
    address: "456 Roysambu St, Nairobi",
    units: 60,
    occupancyRate: 60,
    status: "Active" as const,
    lastUpdated: "Jan 8",
    metrics: {
      views: 950,
      leads: 30,
      applications: 10
    },
    imageUrl: "/roysa.webp"
  },
  {
    id: 3,
    name: "Uthiru Residency",
    address: "789 Uthiru Rd, Nairobi",
    units: 35,
    occupancyRate: 40,
    status: "Off Market" as const,
    lastUpdated: "Jan 2",
    metrics: {
      views: 200,
      leads: 5,
      applications: 1
    },
    imageUrl: "/uthiru.jpg"
  },
  {
    id: 4,
    name: "Regen Apartments",
    address: "101 Regen St, Nairobi",
    units: 25,
    occupancyRate: 90,
    status: "Active" as const,
    lastUpdated: "Jan 15",
    metrics: {
      views: 1800,
      leads: 70,
      applications: 25
    },
    imageUrl: "/regen.jpg"
  },
  {
    id: 5,
    name: "Kabiria Heights",
    address: "202 Kabiria Rd, Nairobi",
    units: 50,
    occupancyRate: 50,
    status: "Active" as const,
    lastUpdated: "Jan 10",
    metrics: {
      views: 700,
      leads: 20,
      applications: 5
    },
    imageUrl: "/kabiria.jpg"
  }
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
