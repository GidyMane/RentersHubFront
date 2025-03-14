"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { getSession } from "next-auth/react"

import { baseUrl } from "@/utils/constants"
import PropertyDetails from "@/components/Test/Rentershub/PropertyView"

export default function PropertyPage() {
  const { id } = useParams() // Get property ID from the URL
  const [property, setProperty] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const session = await getSession()
        const accessToken = session?.user?.accessToken

        if (!accessToken) {
          throw new Error("Unauthorized: No access token found.")
        }

        const response = await axios.get(`${baseUrl}listing/property/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        // console.log(response, "fetched page")
        setProperty(response.data)
      } catch (err) {
        setError("Failed to fetch property details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProperty()
  }, [id])

  return (

      <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
        {loading && <p>Loading property details...</p>}

        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {property ? (
          <PropertyDetails {...property} />
        ) : (
          <p className="text-gray-500" style={{ fontFamily: "Georgia, serif" }}>No property details available.</p>
        )}
      </div>

  )
}
