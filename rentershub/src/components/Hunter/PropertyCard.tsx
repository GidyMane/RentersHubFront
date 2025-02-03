import Image from "next/image"
import { Bath, Bed, Heart, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  imageUrl: string
  price: number
  address: string
  city: string
  state: string
  zip: string
  beds: number
  baths: number
  sqft: number
  isPerfectFit?: boolean
  isHotSpot?: boolean
}

export function PropertyCard({
  imageUrl,
  price,
  address,
  city,
  state,
  zip,
  beds,
  baths,
  sqft,
  isPerfectFit,
  isHotSpot,
}: PropertyCardProps) {
  return (
    <div className="group rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={address}
          width={400}
          height={300}
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {isPerfectFit && (
            <Badge variant="secondary" className="bg-white/90">
              Perfect Fit
            </Badge>
          )}
          {isHotSpot && (
            <Badge variant="secondary" className="bg-white/90">
              Hot spot
            </Badge>
          )}
        </div>
        <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
          <Heart className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span className="text-sm">{sqft.toLocaleString()} Ft²</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">${price.toLocaleString()}</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
        <p className="text-sm text-muted-foreground">
          {city}, {state} {zip}
        </p>
      </div>
    </div>
  )
}

