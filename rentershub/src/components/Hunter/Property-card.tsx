import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Car, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  image: string
  price: number
  address: string
  location: string
  beds: number
  baths: number
  sqft: number
}

export default function PropertyCard({ image, price, address, location, beds, baths, sqft }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group bg-white rounded-xl">
      <div className="relative aspect-[16/10]">
        <Image src={image || "/placeholder.svg"} alt={address} fill className="object-cover" />
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full">
          <Heart className="w-5 h-5" />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{sqft} ft²</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-1">Ksh {price.toLocaleString()}</h3>
        <div className="text-gray-600">
          <div className="font-medium">{address}</div>
          <div className="text-sm">{location}</div>
        </div>
      </CardContent>
    </Card>
  )
}

