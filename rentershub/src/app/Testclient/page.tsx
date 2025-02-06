"use client"

import { useState } from "react"
import { Filters } from "@/components/Hunter/filters"
import { PropertyCard } from "@/components/Hunter/PropertyCard"
import { EmptyState } from "@/components/Hunter/empty-state"
import { PropertyMap } from "@/components/Hunter/property-map"
import { FullScreenCarousel } from "@/components/UpdatedLayout/HeroSections"
import HeroSearchBar from "@/components/UpdatedLayout/HeroSearchBar"
import Component from "@/components/Cards"

// Sample data - replace with your actual data
const allProperties = [
  {
    id: "1",
    imageUrl: "",
    title:"Two BEDroom",
    rentPrice: 28400,
    propertyType:"two bed",
    price: 142900,
    address: "150 Mission Ave",
    city: "Chestertown",
    state: "NY",
    zip: "12817",
    beds: 3,
    baths: 2.5,
    sqft: 1850,
    isPerfectFit: true,
    isHotSpot: true,
    coordinates: [43.2707, -73.7351] as [number, number], // Example coordinates
  },
  // Add more properties as needed
]

export default function PropertyListingPage() {
  const [properties, setProperties] = useState(allProperties)
  const [location, setLocation] = useState("New York, US")
  const [showMap, setShowMap] = useState(false)

  const handleSearch = (filters: any) => {
    // Implement your search logic here
    setProperties(allProperties)
  }

  const resetFilters = () => {
    setProperties(allProperties)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[100vh] relative w-full px-6">
        <FullScreenCarousel />
        {/* Search area */}
        <div className="absolute -bottom-10 z-30 flex justify-center mx-auto inset-x-0">
          <div className="w-fit bg-[#F0F8FF] py-2 px-4 rounded-lg shadow-lg backdrop-blur-lg">
            <h3 className="text-labelLarge p-2 font-bold">Find your next dream house</h3>
            <div className="my-2 p-2">
              <HeroSearchBar />
            </div>
          </div>
        </div>
      </div>

       {/* featured properties */}
       <Component properties={[]} />


      <div className="container mx-auto p-4 space-y-6">
        <Filters
          totalResults={properties.length}
          location={location}
          onSearch={handleSearch}
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
        />

        {properties.length === 0 ? (
          <EmptyState resetFilters={resetFilters} />
        ) : showMap ? (
          <div className="grid lg:grid-cols-[1fr,400px] gap-6 h-[calc(100vh-200px)]">
            <div className="space-y-6 overflow-y-auto pr-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            <div className="sticky top-4 h-full">
              <PropertyMap
                properties={properties.map((p) => ({
                  id: p.id,
                  title: p.address,
                  price: p.price,
                  location: `${p.city}, ${p.state}`,
                  coordinates: p.coordinates,
                }))}
                center={[43.2994, -74.2179]} // Center of NY State
                zoom={7}
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
