import Image from "next/image"
import Link from "next/link"
import { Bath, Bed, Car, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  id: string
  imageUrl: string
  title: string
  propertyType: string
  rentPrice: number
  description: string
  address: string
  city: string
  state: string
  zip: string
  beds: number
  baths: number
  sqft: number
}

export function PropertyCard({
  id,
  imageUrl,
  title,
  propertyType,
  rentPrice,
  description,
  city,
  state,
  zip,
  beds,
  baths,
  sqft
}: PropertyCardProps) {
  return (
    <Link href={`/property/${id}`}>
      <div className="group rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="w-full h-[200px] object-cover"
          />
          <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-600">{propertyType}</p>

          {/* <p className="text-sm text-gray-600">{description}</p> */}
          <p className="text-sm text-gray-600">
            {city}, {state} 
          </p>

          <h3 className="text-2xl font-bold text-primary mt-2">{rentPrice.toLocaleString()} /mo</h3>

          {/* <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t pt-4">
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Bed className="w-4 h-4" />
              <span className="font-semibold">{beds}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Bedrooms</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Bath className="w-4 h-4" />
              <span className="font-semibold">{baths}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Bathrooms</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[#2C7BE5]">
              <Car className="w-4 h-4" />
              <span className="font-semibold">{sqft.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Parking</div>
          </div>
        </div> */}
        </div>
      </div>
    </Link>
  )
}

