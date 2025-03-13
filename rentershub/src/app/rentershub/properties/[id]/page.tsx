"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { getSession } from "next-auth/react"

import { DashboardLayout } from "@/components/Test/Rentershub/DashbordLayout"
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

<<<<<<< HEAD
        console.log(response, "fetched page")
=======
        // console.log(response, "fetched page")
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
<<<<<<< HEAD
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
=======

      <div className="p-4 sm:p-6 lg:p-8" style={{ fontFamily: "Georgia, serif" }}>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        {loading && <p>Loading property details...</p>}

        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {property ? (
          <PropertyDetails {...property} />
        ) : (
<<<<<<< HEAD
          <p className="text-gray-500">No property details available.</p>
        )}
      </div>
    </DashboardLayout>
=======
          <p className="text-gray-500" style={{ fontFamily: "Georgia, serif" }}>No property details available.</p>
        )}
      </div>

>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
  )
}
