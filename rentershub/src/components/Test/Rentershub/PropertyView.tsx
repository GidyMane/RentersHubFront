"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, Bed, Bath, Car, DollarSign, Droplet, Trash2, Shield } from "lucide-react"

interface PropertyDetails {
  id: number
  title: string
  description: string
  property_type: string | null
  price: string
  city: string
  state: string
  country: string
  postal_code: string
  address: string
  location: string | null
  size: number
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  main_image_url: string | null
  images: string[]
  features: string[]
  amenities: number[]
  water_charges: string
  water_deposit: string
  garbage_charges: string
  security_charges: string
  other_charges: string
  posted_by: number
  managed_by: string
  space_types: string[]
}

export default function PropertyDetails({
  title,
  description,
  property_type,
  price,
  city,
  state,
  country,
  postal_code,
  address,
  size,
  bedrooms,
  bathrooms,
  parking_spaces,
  is_available,
  is_approved,
  featured,
  rent_price,
  deposit_amount,
  main_image_url,
  water_charges,
  water_deposit,
  garbage_charges,
  security_charges,
  other_charges,
  managed_by,
}: PropertyDetails) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <p className="text-muted-foreground mt-1">
              {address}, {city}, {state}, {country} {postal_code}
            </p>
          </div>
          <div className="flex gap-2">
            {is_available && <Badge variant="secondary">Available</Badge>}
            {is_approved && <Badge variant="secondary">Approved</Badge>}
            {featured && <Badge>Featured</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-muted-foreground" />
            <span>{property_type || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span>{size} sq ft</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-muted-foreground" />
            <span>{bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-muted-foreground" />
            <span>{bathrooms} Bathrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-muted-foreground" />
            <span>{parking_spaces} Parking Spaces</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p>{description}</p>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="font-semibold">Pricing</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>Price: ${price}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>Rent: ${rent_price}/month</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>Deposit: ${deposit_amount}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <h3 className="font-semibold">Additional Charges</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-muted-foreground" />
              <span>Water: ${water_charges}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-muted-foreground" />
              <span>Water Deposit: ${water_deposit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              <span>Garbage: ${garbage_charges}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span>Security: ${security_charges}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span>Other: ${other_charges}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Managed by: {managed_by}</span>
          {main_image_url && (
            <img src={main_image_url || "/placeholder.svg"} alt={title} className="w-24 h-24 object-cover rounded" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

