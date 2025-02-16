import { useState, useEffect } from "react"

import { Filters } from "@/components/Hunter/filters"
import { PropertyCard } from "@/components/Hunter/PropertyCard"
import { EmptyState } from "@/components/Hunter/empty-state"
import { FullScreenCarousel } from "@/components/UpdatedLayout/HeroSections"
import HeroSearchBar from "@/components/UpdatedLayout/HeroSearchBar"
import { Property } from "@/types/property"
import { fetchProperties } from "@/actions/fetchproperties"

export default async function PropertyListingPage() {
  // const [properties, setProperties] = useState<Property[]>([])
  // const [location, setLocation] = useState("New York, US")
  // const [showMap, setShowMap] = useState(false)

  // console.log(properties, "property state")
  const properties = await fetchProperties()

  const resetFilters = () => {}
  // useEffect(() => {
  //   async function loadProperties() {
  //     try {
  //       const data = await fetchProperties()
  //       console.log("Fetched Properties:", data) 
  //       setProperties(data)
  //     } catch (error) {
  //       console.error("Error fetching properties:", error)
  //     }
  //   }

  //   loadProperties()
  // }, [])

  // const handleSearch = (filters: any) => {
  //   setProperties(properties)
  // }

  // const resetFilters = () => {
  //   setProperties(properties)
  // }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[100vh] relative w-full px-6">
        <FullScreenCarousel />
        <div className="absolute -bottom-10 z-30 flex justify-center mx-auto inset-x-0">
          <div className="w-fit bg-[#F0F8FF] py-2 px-4 rounded-lg shadow-lg backdrop-blur-lg">
            <h3 className="text-labelLarge p-2 font-bold">Find your next dream house</h3>
            <div className="my-2 p-2">
              <HeroSearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6 mt-8">
        {/* <Filters
          totalResults={properties.length}
          location={location}
          onSearch={handleSearch}
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
        /> */}

        {properties.length === 0 ? (
          <EmptyState resetFilters={resetFilters} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id.toString()}
                title={property.title}
                description={property.description}
                rentPrice={parseFloat(property.rent_price)}
                address={property.address}
                imageUrl={property.main_image_url?.url || "/placeholder.svg"}
                propertyType={property.propertytype?.name }
                city={property.city}
                state={property.state}
                zip={property.postal_code || ""}
                beds={property.bedrooms || 0}
                baths={property.bathrooms || 0}
                sqft={property.size || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
