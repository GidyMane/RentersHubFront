"use client"

import type React from "react"

import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import {
  MapPin,
  Camera,
  Check,
  Building2,
  Cctv,
  Loader,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Share2,
  X,
  Maximize2,
} from "lucide-react"
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

interface ImageType {
  id: string
  url: string
}

export interface PropertyResponse {
  id: number
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
  images: ImageType[]
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
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showChatDialog, setShowChatDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showFullscreenImage, setShowFullscreenImage] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [showGalleryDialog, setShowGalleryDialog] = useState(false)
  const [galleryViewMode, setGalleryViewMode] = useState<"grid" | "slideshow">("grid")

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

  // Handle autoplay for slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay && showGalleryDialog && galleryViewMode === "slideshow") {
      interval = setInterval(() => {
        setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }, 3000)
    }

    return () => clearInterval(interval)
  }, [autoplay, showGalleryDialog, galleryViewMode, images.length])

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextImage()
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevImage()
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGalleryDialog || showFullscreenImage) {
        if (e.key === "ArrowRight") nextImage()
        if (e.key === "ArrowLeft") prevImage()
        if (e.key === "Escape") {
          setShowGalleryDialog(false)
          setShowFullscreenImage(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showGalleryDialog, showFullscreenImage])

  const formatCurrency = (amount: string | number) => {
    return `Ksh ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(Number(amount))
      .replace("KES", "")
      .trim()}`
  }

  return (
    <div className="mx-auto relative pb-20 md:pb-0" style={{ fontFamily: "Georgia, serif" }}>
      {/* Creative Background for Gallery Section */}
      <div className="relative w-full bg-gradient-to-b from-primary/5 to-background">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute top-40 right-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl"></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>

            {/* Subtle Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, black 2%, transparent 0%), 
                                     radial-gradient(circle at 75px 75px, black 2%, transparent 0%)`,
                backgroundSize: "100px 100px",
                backgroundPosition: "0 0",
              }}
            ></div>
          </div>
        </div>

        {/* Full-width container for mobile */}
        <div className="w-full relative z-10 pt-0 md:pt-6 pb-0 md:pb-2 px-0 md:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-2">
            {/* Main Image Section - Full width on mobile, 8/12 on large screens */}
            <div className="lg:col-span-8 relative w-full">
              <div
                className="relative w-full h-[70vh] sm:h-[60vh] md:h-auto md:aspect-[4/3]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {images.length > 0 ? (
                  <div className="relative h-full w-full overflow-hidden md:rounded-xl shadow-lg">
                    <Image
                      src={images[selectedImage] || "/placeholder.svg"}
                      alt="Property"
                      fill
                      className={`object-contain bg-white/80 backdrop-blur-sm transition-transform duration-300 ${
                        isZoomed ? "scale-150" : "scale-100"
                      }`}
                      priority
                      onClick={() => setIsZoomed(!isZoomed)}
                    />

                    {/* Watermark */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                      <Image src="/RH1.png" alt="Watermark" width={150} height={150} className="object-contain" />
                    </div>

                    {/* Image Navigation Controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage()
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage()
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter - Keeping original style */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 text-xs md:text-sm rounded-full backdrop-blur-sm">
                      {selectedImage + 1} / {images.length}
                    </div>

                    {/* Fullscreen button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFullscreenImage(true)
                      }}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      aria-label="View fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* View All Photos Button - Smaller on mobile */}
                    <button
                      onClick={() => setShowGalleryDialog(true)}
                      className="absolute bottom-4 left-4 bg-primary text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm flex items-center hover:bg-primary/90 transition-colors font-medium shadow-md backdrop-blur-sm"
                    >
                      <Camera className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span className="whitespace-nowrap">View all</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 md:rounded-xl">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Gallery - Takes 4/12 on large screens */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                {images.slice(0, 4).map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative overflow-hidden cursor-pointer transition-all rounded-xl shadow-md ${
                      idx === 0 ? "col-span-2 row-span-1" : ""
                    } ${selectedImage === idx ? "ring-2 ring-primary" : "hover:opacity-90"}`}
                  >
                    <Image src={src || "/placeholder.svg"} alt={`Gallery ${idx + 1}`} fill className="object-cover" />

                    {/* Watermark for right side gallery */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                      <Image src="/RH1.png" alt="Watermark" width={60} height={60} className="object-contain" />
                    </div>

                    {idx === 3 && images.length > 4 && (
                      <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowGalleryDialog(true)
                        }}
                      >
                        <span className="text-white font-medium">+{images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation - Styled with creative background */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 p-2 md:p-3 bg-white/30 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent border-y border-primary/10">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-transform hover:scale-105 ${
                  selectedImage === idx ? "border-primary shadow-md" : "border-transparent"
                }`}
              >
                <Image src={src || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Property Quick Info Bar */}
        <div className="bg-white/80 backdrop-blur-md shadow-md rounded-lg mx-2 lg:mx-auto lg:max-w-5xl p-4 relative z-10 -mt-2 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 border border-primary/10">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Property Type</span>
            <span className="font-semibold">{property?.propertytype?.name || "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Location</span>
            <span className="font-semibold truncate">{property?.address || "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Price</span>
            <span className="font-semibold text-primary">{formatCurrency(property?.rent_price)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Managed By</span>
            <span className="font-semibold">{property?.managed_by || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Gallery Dialog */}
      <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-lg font-semibold">Property Images</DialogTitle>
              <div className="flex items-center gap-2 border rounded-full p-1">
                <button
                  onClick={() => setGalleryViewMode("grid")}
                  className={`px-3 py-1 rounded-full text-sm ${galleryViewMode === "grid" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setGalleryViewMode("slideshow")}
                  className={`px-3 py-1 rounded-full text-sm ${galleryViewMode === "slideshow" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  Slideshow
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {galleryViewMode === "slideshow" && (
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setAutoplay(!autoplay)}>
                  {autoplay ? "Pause" : "Autoplay"}
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </DialogClose>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow">
            {galleryViewMode === "grid" ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 p-4 space-y-4">
                {images.map((src, idx) => (
                  <div key={idx} className="break-inside-avoid mb-4">
                    <div
                      className="relative rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedImage(idx)
                        setGalleryViewMode("slideshow")
                      }}
                    >
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Property ${idx + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                      />

                      {/* Watermark for grid view */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                        <Image src="/RH1.png" alt="Watermark" width={80} height={80} className="object-contain" />
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded-full">
                        {idx + 1} / {images.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="relative w-full max-w-3xl h-[70vh] mx-auto">
                  <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={`Property ${selectedImage + 1}`}
                    fill
                    className="object-contain"
                  />

                  {/* Watermark for gallery slideshow */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                    <Image src="/RH1.png" alt="Watermark" width={180} height={180} className="object-contain" />
                  </div>

                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                </div>

                <div className="flex overflow-x-auto gap-2 mt-4 max-w-full">
                  {images.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImage === idx ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Dialog */}
      <Dialog open={showFullscreenImage} onOpenChange={setShowFullscreenImage}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-0 bg-black">
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={`Property ${selectedImage + 1}`}
              fill
              className="object-contain"
            />

            {/* Watermark for fullscreen view */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <Image src="/RH1.png" alt="Watermark" width={200} height={200} className="object-contain" />
            </div>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>

            <button
              onClick={() => setShowFullscreenImage(false)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

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

        {/* Mobile Contact Buttons - Visible only on mobile */}
        <div className="md:hidden mb-6">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-2">
                <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Call Landlord</DialogTitle>
                    <CallLandlordForm
                      landlordPhone={property?.owners_contact}
                      propertyId={property?.title?.toString() ?? ""}
                      propId={property?.id}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Chat with Landlord</DialogTitle>
                    <ChatWithLandlord
                      landlordPhone={property?.owners_contact}
                      propertyId={property?.title?.toString() ?? ""}
                      propId={property?.id}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg" variant="secondary">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Share Property</DialogTitle>
                    <ShareButton
                      propertyLink={`https://rentershub.co.ke/Property/${encodeURIComponent(property?.title)}`}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Details Card */}
        <Card className="mb-8 shadow-md border border-primary/10">
          <CardHeader className="bg-primary/5 rounded-t-lg">
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
              <Card className="shadow-md border border-primary/10">
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
              <Card className="shadow-md border border-primary/10">
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
            <Card className="shadow-md border border-primary/10">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black font-bold">{property?.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-md border border-primary/10">
              <CardHeader className="bg-primary/5 rounded-t-lg">
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

            {/* Location - Keeping original icon and layout */}
            <Card className="shadow-md border border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between bg-primary/5 rounded-t-lg">
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

                <div className="h-[300px] w-full rounded-lg overflow-hidden shadow-md">
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

          {/* Right Column - Contact Form - Hidden on mobile */}
          <div className="hidden md:block space-y-6">
            <Card className="sticky top-6 shadow-md border border-primary/10">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CallLandlordForm
                    landlordPhone={property?.owners_contact}
                    propertyId={property?.title?.toString() ?? ""}
                    propId={property?.id}
                  />
                  <ChatWithLandlord
                    landlordPhone={property?.owners_contact}
                    propertyId={property?.title?.toString() ?? ""}
                    propId={property?.id}
                  />
                  <ShareButton
                    propertyLink={`https://rentershub.co.ke/Property/${encodeURIComponent(property?.title)}`}
                  />
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

      {/* Mobile Fixed Contact Bar - Visible only on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          <Button className="w-full" onClick={() => setShowCallDialog(true)}>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
          <Button className="w-full" variant="outline" onClick={() => setShowChatDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => setShowShareDialog(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}

