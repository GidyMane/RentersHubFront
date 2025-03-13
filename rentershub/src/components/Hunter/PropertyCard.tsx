<<<<<<< HEAD
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
=======
import Image from "next/image";
import Link from "next/link";
import { MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "../ui/card";
import { motion } from "framer-motion";

interface PropertyCardProps {
  id: string;
  imageUrl: string;
  title: string;
  propertyType: string;
  rentPrice: number;
  city: string;
  state: string;
  managed_by: string;
  updated_at: Date;
}

// Handle WhatsApp share
function handleShare(id: string, title: string) {
  const url = `https://wa.me/?text=Check out this property: ${title} - ${window.location.origin}/property/${title}`;
  window.open(url, "_blank");
}

// Truncate title for better UI
function truncateTitle(title: string, wordLimit: number = 6) {
  const words = title.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
}

export function PropertyCard({
  id,
  imageUrl,
  title,
  propertyType,
  rentPrice,
<<<<<<< HEAD
  description,
  city,
  state,
  zip,
  beds,
  baths,
  sqft
}: PropertyCardProps) {
  return (
    <Link href={`/Testclient/property/${id}`}>
      <div className="group rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="w-full h-[200px] object-cover"
          />
          <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-red-500">
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

          <h3 className="text-2xl font-bold text-primary mt-2">{rentPrice.toLocaleString()} /Month</h3>

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

=======
  city,
  state,
}: PropertyCardProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      {/* Make the whole card a clickable Link */}
      <Link href={`/property/${title}`} passHref className="block">
        <Card className="overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg w-full" style={{ fontFamily: "Georgia, serif" }}>
          <div className="relative">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              width={400}
              height={300}
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="bg-gray-900/60 hover:bg-gray-900/70 text-white rounded-full h-8 w-8"
                onClick={(e) => {
                  e.preventDefault(); // Prevent link navigation when sharing
                  handleShare(id, title);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-bold">{truncateTitle(title)}</h3>
            <Badge variant="secondary" className="mb-2">
              {propertyType}
            </Badge>
            <div className="flex items-center gap-1 text-muted">
              <MapPin className="h-4 w-4" />
              <span className="text-sm text-black">{city}, {state}</span>
            </div>
            <h3 className="text font-bold text-primary mt-2">
              {rentPrice.toLocaleString()} pm
            </h3>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
