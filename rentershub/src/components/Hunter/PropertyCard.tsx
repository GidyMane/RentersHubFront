import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  id: string
  imageUrl: string
  title: string
  propertyType: string
  rentPrice: number
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
  address,
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

          <p className="text-sm text-muted-foreground">{address}</p>
          <p className="text-sm text-muted-foreground">
            {city}, {state} {zip}
          </p>

          <h3 className="text-2xl font-bold text-primary mt-2">{rentPrice.toLocaleString()} /mo</h3>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <span className="text-sm">{beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">{baths} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">{sqft.toLocaleString()} Ft²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
