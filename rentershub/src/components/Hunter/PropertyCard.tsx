import Image from "next/image"
import Link from "next/link"
import { MapPin, Share2, PhoneIcon as WhatsApp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardFooter } from "../ui/card"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

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
}

function handleShare(id: string, title: string) {
  const url = `https://wa.me/?text=Check out this property: ${title} - ${window.location.origin}/property/${id}`;
  window.open(url, '_blank');
}

export function PropertyCard({
  id,
  imageUrl,
  title,
  propertyType,
  rentPrice,
  city,
  state,
  managed_by,
  updated_at,
}: PropertyCardProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      <Card className="overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg">
        <Link href={`/property/${id}`}>
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
                onClick={() => handleShare(id, title)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <Badge variant="secondary" className="mb-2">
              {propertyType}
            </Badge>
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="flex items-center gap-1 text-muted">
              <MapPin className="h-4 w-4" />
              <span className="text-sm"> {city}, {state} </span>
            </div>
            <h3 className="text-2xl font-bold text-primary mt-2">
              {rentPrice.toLocaleString()} /Month
            </h3>
          </div>
        </Link>
        <CardFooter className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={managed_by} />
              <AvatarFallback>{managed_by[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">Managed by {managed_by}</div>
          </div>
          {/* <div className="text-sm text-muted">
            {formatDistanceToNow(new Date(updated_at))}
          </div> */}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
