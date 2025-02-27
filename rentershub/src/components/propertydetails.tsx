"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { MapPin, Camera, Check, Building2, User, Cctv, Loader, ChevronLeft, ChevronRight } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useInView } from "react-intersection-observer"
import CallLandlordForm from "./CallLandlord"
import ChatWithLandlord from "./ChatLandlord"
import ShareButton from "./ShareWhatsapp"
import PropertyRender from "./PropertyRender"

// Fix for default marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
})

export interface ImageData {
  id: number
  url: string
  publicId: string
  propertyId: number
  createdAt: string
  updatedAt: string
}

export interface PropertyFeature {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface PropertyType {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export type SimilarPropertyData = {
  id: number
  name: string
  county: string
  images: ImageData[]
  bedrooms: number
  size: string
  saleType: string
  price: number
  propertyType: PropertyType
}

export interface PropertyData {
  id: number
  name: string
  description: string
  streetAddress: string
  city: string
  area: string
  state: string
  country: string
  location_coords: string
  county: string
  latitude: string
  longitude: string
  saleType: string
  featured: boolean
  propertyTypeId: number
  size: string
  distance: string
  price: number
  pricePerMonth: number
  bedrooms: number
  bathrooms: number
  createdAt: string
  updatedAt: string
  propertyToFeatures: PropertyFeature[]
  propertyType: PropertyType
}

interface Image {
  id: string
  url: string
}

export interface PropertyResponse {
  status: string
  data: {
    property: PropertyData
  }
  title: string
  propertytype: { id: number; name: string }
  updated_at: string
  description: string
  city: string
  state: string
  country: string
  postal_code: string
  address: string
  location: string
  location_coords: string
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  main_image_url: { id: string; url: string }
  images: Image[]
  features: { id: number; name: string }
  water_charges: string
  water_deposit: string
  garbage_charges: string
  security_charges: string
  other_charges: string
  posted_by: number
  managed_by: string
  property_features: { id: number; name: string }
  owners_contact: string
}

export default function PropertyDetail({
  property,
  similarproperties,
}: {
  property: PropertyResponse
  similarproperties: any
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const position: [number, number] = property?.location_coords
    ? [Number(property.location_coords[1]), Number(property.location_coords[0])]
    : [-1.2345, 36.80271] // Default fallback coordinates

  const images: string[] = [
    property?.main_image_url?.url ?? "",
    ...(Array.isArray(property?.images) ? property.images.map((img: { url: string }) => img.url) : []),
  ].filter(Boolean)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    }).format(Number(amount))
  }

  return (
    <div className="mx-auto">
      {/* Image Gallery - Full Width */}
      <div className="relative w-full">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
          {images.length > 0 ? (
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt="Property"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <p className="text-gray-500">No images available</p>
            </div>
          )}

          {/* Image Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div>

          {/* View All Photos Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute bottom-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center hover:bg-primary/90 transition-colors font-medium">
                <Camera className="w-4 h-4 mr-2" />
                View all photos
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-2 mt-4">
                <DialogTitle className="text-lg font-semibold">Property Images</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Back
                  </Button>
                </DialogClose>
              </div>
              <div className="overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((src, idx) => (
                    <div key={idx} className="relative aspect-video">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Property ${idx + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === idx ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={src || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Title and Price Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
              <div className="flex items-center text-black mt-2">
                <MapPin className="w-4 h-4 mr-2 font-bold flex-shrink-0" />
                <span className="text-sm font-bold md:text-base">{`${property.address}, ${property.state}`}</span>
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(property.rent_price)}</div>
          </div>
        </div>

        {/* Price Details Card - Moved to top priority */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black font-bold">Rent Amount:</span>
                  <span className="font-bold">{formatCurrency(property?.rent_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Deposit Amount:</span>
                  <span className="font-bold">{formatCurrency(property?.deposit_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Water Charges:</span>
                  <span className="font-bold">{formatCurrency(property?.water_charges)} per unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Water Deposit:</span>
                  <span className="font-bold">{formatCurrency(property?.water_deposit)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black font-bold">Garbage Charges:</span>
                  <span className="font-bold">{formatCurrency(property?.garbage_charges)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Security Charges:</span>
                  <span className="font-bold">{formatCurrency(property?.security_charges)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-bold">Other Charges:</span>
                  <span className="font-bold">{formatCurrency(property?.other_charges)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Left Column - Property Details */}
          <div className="space-y-8">
            {/* Property Type and Management */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-secondary">Property Type</p>
                      <p className="font-bold">{property?.propertytype?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Cctv className="w-4 h-4 text-muted" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-secondary">Managed By</p>
                      <p className="font-bold">{property?.managed_by}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black font-bold">{property?.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {property?.property_features && Array.isArray(property.property_features) ? (
                  <div className="grid grid-cols-1 font-bold md:grid-cols-2 gap-4">
                    {property.property_features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No features available</p>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Location</CardTitle>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const [latitude, longitude] = position
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
                    window.open(mapsUrl, "_blank")
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open on Google Maps
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-bold text-secondary">City</div>
                    <div>{property?.city}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">Area</div>
                    <div>{property?.address}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">State/county</div>
                    <div>{property?.state}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary">Country</div>
                    <div>{property?.country}</div>
                  </div>
                </div>

                <div className="h-[300px] w-full rounded-lg overflow-hidden">
                  <MapContainer center={position} zoom={13} className="w-full h-full z-0">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                      <Popup>{property?.address || "Property Location"}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Renters Hub</h3>
                    <Button variant="link" className="h-auto p-0">
                      Connect with Us
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <CallLandlordForm landlordPhone={property?.owners_contact} propertyId={""} />
                  <ChatWithLandlord landlordPhone={property?.owners_contact} propertyId={""} />
                  <ShareButton propertyLink={typeof window !== "undefined" ? window.location.href : ""} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">Other Properties In the Same Area</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Suspense
              fallback={
                <div className="col-span-full flex justify-center py-8">
                  <Loader className="animate-spin" />
                </div>
              }
            >
              {similarproperties[0] === 200 && similarproperties[1].length > 0 ? (
                similarproperties[1].map((property: any, idx: number) => (
                  <PropertyRender property={property} key={idx} />
                ))
              ) : (
                <p className="col-span-full text-center py-4">No similar properties available</p>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

