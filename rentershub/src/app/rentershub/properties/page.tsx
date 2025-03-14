"use client"
import { FilterBar } from "@/components/Test/Rentershub/FilterBar"
import { PropertyCard } from "@/components/Test/Rentershub/PropertyCard"
import { useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import axios from "axios"

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
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
        console.log(response, "proeprties")

        setProperties(response.data.results || [])
      } catch (error) {
        console.error(error)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties based on status
  const filteredProperties = properties.filter((property) => {
    if (status === "all") return true
    if (status === "approved") return property.is_approved
    if (status === "notapproved") return !property.is_approved
    return true
  })

  // Sort properties based on sortOrder
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const dateA = new Date(a.updated_at).getTime()
    const dateB = new Date(b.updated_at).getTime()

    if (sortOrder === "newest") {
      return dateB - dateA // Newest first
    } else {
      return dateA - dateB // Oldest first
    }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532]">My Properties</h1>
        </div>

        <FilterBar
          view={view}
          onViewChange={setView}
          status={status}
          onStatusChange={setStatus}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => (
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
                main_image_url={property.main_image_url?.url || "/placeholder.svg"}
                id={property.id}
              />
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

