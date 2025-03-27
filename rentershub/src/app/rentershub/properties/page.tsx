"use client"
import { FilterBar } from "@/components/Test/Rentershub/FilterBar"
import { PropertyCard } from "@/components/Test/Rentershub/PropertyCard"
import { useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [status, setStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [properties, setProperties] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20 // Number of items per page from the API

  useEffect(() => {
    fetchProperties(currentPage)
  }, [currentPage, status, sortOrder])

  const fetchProperties = async (page: number) => {
    setIsLoading(true)
    try {
      const session = await getSession()
      const userId = session?.user?.user_id

      if (!userId) {
        throw new Error("User ID not found in session")
      }

      // Add pagination parameters to the API call
      const response = await axios.get(`${baseUrl}listing/property?userid=${userId}&page=${page}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })

      console.log(response, "properties")

      // Update state with the new data
      setProperties(response.data.results || [])

      // Calculate total pages based on total count from API
      if (response.data.count) {
        setTotalCount(response.data.count)
        setTotalPages(Math.ceil(response.data.count / pageSize))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page range around current page
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#1C4532]" />
          </div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
            >
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
                <div className="col-span-full text-center py-10">
                  <p>No properties found.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="h-10 px-4 py-2 border border-[#1C4532] text-[#1C4532] hover:bg-[#E6F0EB]"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center">
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <Button
                        key={index}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => goToPage(page)}
                        className={`mx-1 h-10 w-10 ${
                          currentPage === page
                            ? "bg-[#1C4532] text-white"
                            : "border border-[#1C4532] text-[#1C4532] hover:bg-[#E6F0EB]"
                        }`}
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={index} className="mx-1">
                        {page}
                      </span>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="h-10 px-4 py-2 border border-[#1C4532] text-[#1C4532] hover:bg-[#E6F0EB]"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Showing results summary */}
            <div className="text-center text-sm text-primary mt-4">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of{" "}
              {totalCount} properties
            </div>
          </>
        )}
      </div>
    </div>
  )
}

