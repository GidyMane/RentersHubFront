"use client"

import { useState } from "react"
import Header from "@/components/Hunter/Header"
import PropertyCard from "@/components/Hunter/Property-card"
import MapView from "@/components/Hunter/map-view"
import { Button } from "@/components/ui/button"
import { LayoutGrid, MapIcon } from "lucide-react"

const properties = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=400",
    price: 142900,
    address: "120 Milburn Ave",
    location: "Kilimani, Nairobi",
    beds: 3,
    baths: 2,
    sqft: 1824,
    lat: -1.2921,
    lng: 36.8219,
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=400",
    price: 128700,
    address: "456 Valley Road",
    location: "Westlands, Nairobi",
    beds: 3,
    baths: 2,
    sqft: 1650,
    lat: -1.2731,
    lng: 36.8119,
  },
  // Add more properties with lat/lng coordinates
]

export default function Home() {
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{properties.length} Properties Available</h2>
          <div className="flex items-center gap-2">
            <Button variant={showMap ? "outline" : "default"} size="sm" onClick={() => setShowMap(false)}>
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button variant={showMap ? "default" : "outline"} size="sm" onClick={() => setShowMap(true)}>
              <MapIcon className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {showMap ? (
          <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
            <MapView properties={properties} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

