"use client"

import { DashboardLayout } from "@/components/Test/Rentershub/DashbordLayout"
import { FilterBar } from "@/components/Test/Rentershub/FilterBar"
import { PropertyCard } from "@/components/Test/Rentershub/PropertyCard"
import { useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import axios from "axios"

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [status, setStatus] = useState("all")
  const [properties, setProperties] = useState<any[]>([])


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const session = await getSession()
        const userId = session?.user?.user_id

        if (!userId) {
          throw new Error("User ID not found in session")
        }

        const response = await axios.get(`${baseUrl}listing/property?userid=${userId}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

        // console.log(response, "propatis")

        setProperties(response.data.results || [])
      } catch (error) {
        console.error(error)
      }
    }

    fetchProperties()
  }, [])

  const filteredProperties = properties.filter((property) => {
    if (status === "all") return true
    if (status === "available") return property.is_available
    if (status === "unavailable") return !property.is_available
    return true
  })

  // console.log(filteredProperties, "filter")

  return (
    
      <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">My Properties</h1>
          </div>

          <FilterBar view={view} onViewChange={setView} status={status} onStatusChange={setStatus} />

          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  title={property.title}
                  address={property.address}
                  city={property.city}
                  state={property.state}
                  bedrooms={property.bedrooms || 0}
                  bathrooms={property.bathrooms || 0}
                  parking_spaces={property.parking_spaces || 0}
                  rent_price={property.rent_price}
                  is_available={property.is_available}
                  is_approved={property.is_approved}
                  featured={property.featured}
                  date={property.updated_at}
                  main_image_url={property.main_image_url?.url || "/placeholder.svg"} id={property.id}              />
              ))
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        </div>
      </div>
    
  )
}
