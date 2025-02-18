"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, MapPin, Facebook, Instagram, PhoneIcon as WhatsApp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

interface PropertyCardProps {
    id: string // Added id for unique property identification
    title: string
    address: string
    rent_price: number
    managed_by: string
    featured: boolean
    main_image_url: any
    updated_at: Date
    propertytype:{
        name:string;
    },
   
    bedrooms:number;
    bathrooms:number

  imageUrl: string
  
  propertyType: string
  rentPrice: number
  description: string
 
  city: string
  state: string
  zip: string
  beds: number
  baths: number
  sqft: number
  
}


export function PropertyCard({
    id,
    title,
    address,
    rent_price,
    managed_by,
    propertytype,
    featured,
    main_image_url,
    updated_at,
    bedrooms,
    bathrooms,
    imageUrl,
    propertyType,
    rentPrice,
    description,
    
  
   
}: PropertyCardProps) {
    // Format price to KSH
    const formattedPrice = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(rent_price ?? 0)

    let image_url = main_image_url?.url?.length > 0 ? main_image_url?.url : "/14.jpg"

    // Generate sharing URLs
    const shareUrl = `$/property/${id}`
    const shareText = `Check out this property: ${title} - ${formattedPrice}/month`

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
        instagram: `https://www.instagram.com/rentershub.co.ke?igsh=MTVzcmh5Z2EwY3IwZg==`
    }

    const handleShare = (e: React.MouseEvent, platform: string) => {
        e.preventDefault() // Prevent card click when sharing
        e.stopPropagation() // Prevent event bubbling

        if (platform === 'instagram') {
            window.open(shareLinks.instagram, '_blank')
            return
        }

        window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400')
    }

    return (
        <motion.div className=""
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
        >
            <Card className="overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader className="p-0 relative">
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <Badge variant="secondary" className="bg-gray-900/60 text-white hover:bg-gray-900/60">
                            For Rent
                        </Badge>
                        {featured && (
                            <Badge className="bg-red-500 hover:bg-red-500/90">
                                Featured
                            </Badge>
                        )}
                    </div>
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="bg-gray-900/60 hover:bg-gray-900/70 text-white rounded-full h-8 w-8"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                                <div className="grid gap-4">
                                    <h4 className="font-medium leading-none">Share Property</h4>
                                    <div className="grid gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={(e) => handleShare(e, 'facebook')}
                                        >
                                            <Facebook className="h-4 w-4" />
                                            Facebook
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={(e) => handleShare(e, 'whatsapp')}
                                        >
                                            <WhatsApp className="h-4 w-4" />
                                            WhatsApp
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={(e) => handleShare(e, 'instagram')}
                                        >
                                            <Instagram className="h-4 w-4" />
                                            Instagram
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="bg-gray-900/60 hover:bg-gray-900/70 text-white rounded-full h-8 w-8"
                            onClick={(e) => e.preventDefault()} // Prevent card click when favoriting
                        >
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                        {main_image_url?.url && main_image_url?.url?.length > 0 ? (
                            <Image
                                src={'/14.jpg'}

                                alt={title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        ):(
                            <p className="h-fullw-full text-center">No image Available</p>
                        )}

                        <div className="absolute bottom-4 left-4 z-20">
                            <div className="text-white text-2xl font-semibold">
                                {formattedPrice}
                                <span className="text-sm font-normal">/mo</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <Link href={`/property/${id}`}><CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                        {propertytype.name}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                            <div className="font-semibold">Beds</div>
                            <div className="text-muted-foreground">{bedrooms}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Baths</div>
                            <div className="text-muted-foreground">{bathrooms}</div>
                        </div>
                        {/* <div>
                            <div className="font-semibold">Area</div>
                            <div className="text-muted-foreground">5280 sq ft</div>
                        </div> */}
                    </div>
                </CardContent>
                    <CardFooter className="p-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" alt={managed_by} />
                                <AvatarFallback>{managed_by[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{managed_by}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(updated_at))}</div>
                    </CardFooter>
                </Link>
            </Card>
        </motion.div>

    )
}
