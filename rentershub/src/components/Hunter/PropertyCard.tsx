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
  const url = `https://wa.me/?text=Check out this property: ${title} - ${encodeURIComponent(`${window.location.origin}/property/${title}`)}`;
  window.open(url, "_blank");
}

// Truncate title for better UI
function truncateTitle(title: string, wordLimit: number = 6) {
  const words = title.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
}

export function PropertyCard({
  id,
  imageUrl,
  title,
  propertyType,
  rentPrice,
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
