"use client"

import { DashboardLayout } from "@/components/Test/Rentershub/DashbordLayout"
import { FilterBar } from "@/components/Test/Rentershub/FilterBar"
import { PropertyCard } from "@/components/Test/Rentershub/PropertyCard"
import { useState } from "react"

// Updated properties for the new structure
const properties = [
  {
    id: 1,
    title: "The Kilimani Haven",
    description: "A beautiful apartment in Kilimani",
    address: "123 Kilimani Rd",
    city: "Nairobi",
    state: "Nairobi",
    country: "Kenya",
    postal_code: "00100",
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 1,
    is_available: false,
    is_approved: false,
    featured: true,
    rent_price: "150000.00",
    deposit_amount: "150000.00",
    main_image_url: "/kilimani.jpg",
  },
  
]

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [status, setStatus] = useState("all")

  const filteredProperties = properties.filter((property) => {
    if (status === "all") return true
    if (status === "available") return property.is_available
    if (status === "unavailable") return !property.is_available
    return true
  })

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">My Properties</h1>
          </div>

          <FilterBar view={view} onViewChange={setView} status={status} onStatusChange={setStatus} />

          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

