"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Car } from "lucide-react"
import { useRouter } from "next/navigation"

interface PropertyCardProps {
  id: number
  title: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  rent_price: string
  is_available: boolean
  is_approved: boolean
  date: string
  featured: boolean
  main_image_url: string | null
}

export function PropertyCard({
  id,
  title,
  address,
  city,
  state,
  bedrooms,
  bathrooms,
  parking_spaces,
  rent_price,
  is_available,
  date,
  is_approved,
  featured,  
  main_image_url,
}: PropertyCardProps) {
  const router = useRouter()

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Navigate to property details page when card is clicked
  const handleClick = () => {
    router.push(`/rentershub/properties/${id}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
      <div className="relative h-48 overflow-hidden">
        <img src={main_image_url || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-[#1C4532]">{title}</h3>
            <p className="text-sm text-gray-600">
              {address}, {state}
            </p>
          </div>
          <div className="flex gap-1">
            {is_approved && <Badge variant="secondary">Approved</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-gray-500">Rent: KeS {rent_price}/month</div>
        <div className="text-xs text-gray-500 mt-2">Last Updated: {formattedDate}</div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t pt-4">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Bed className="w-4 h-4" />
              <span className="font-semibold">{bedrooms}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Bedrooms</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Bath className="w-4 h-4" />
              <span className="font-semibold">{bathrooms}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Bathrooms</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Car className="w-4 h-4" />
              <span className="font-semibold">{parking_spaces}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Parking</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
