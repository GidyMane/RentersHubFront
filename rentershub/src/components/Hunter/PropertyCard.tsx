"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Share2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "../ui/card"

interface PropertyCardProps {
  id: string
  imageUrl: string
  title: string
  propertyType: string
  rentPrice: number
  city: string
  state: string
  managed_by: string
  updated_at: Date
  address: string
}

// Handle WhatsApp share
function handleShare(id: string, title: string, e: React.MouseEvent) {
  e.preventDefault() // Prevent link navigation when sharing
  e.stopPropagation() // Stop event propagation
  const url = `https://wa.me/?text=Check out this property: ${title}%0A%0A${`${window.location.origin}/property/${encodeURIComponent(title)}`}`
  window.open(url, "_blank")
}

// Format price with currency
function formatPrice(price: number) {
  return `Ksh ${price.toLocaleString()}`
}

// Truncate title for better UI
function truncateTitle(title: string, wordLimit = 6) {
  const words = title.split(" ")
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title
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
  managed_by,
  updated_at,
}: PropertyCardProps) {
  return (
    <Link href={`/property/${encodeURIComponent(title)}`} passHref className="block h-full">
      <Card
        className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full flex flex-col bg-white border border-gray-100"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Image Container with clean overlay */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] relative">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 line-clamp-2">{truncateTitle(title)}</h3>

            {/* Property details moved below title */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-gray-100 text-primary font-medium">
                {propertyType}
              </Badge>

             
            </div>
            <div className="flex items-center justify-between mb-2">
            <div className="text-primary font-bold">{formatPrice(rentPrice)} pm</div>
            </div>
            <div className="flex items-center gap-1 text-black mb-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm truncate">
                {address}, {state}
              </span>
            </div>

            {/* Share button moved below */}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full text-primary border-primary hover:bg-primary/10"
              onClick={(e) => handleShare(id, title, e)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Additional Details */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-black">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{managed_by || "Private Owner"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

