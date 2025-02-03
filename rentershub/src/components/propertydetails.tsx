"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Bed,
  Square,
  MapPin,
  Camera,
  Check,
  Share2,
  Building2,
  User,
  Maximize2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import Link from "next/link";
import { PropertyCarousel } from "./Cards";
import { useInView } from "react-intersection-observer";
import toast, { ToastBar, Toaster } from "react-hot-toast";

// Fix for default marker icon
// delete L.Icon.Default.prototype
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});
export interface ImageData {
  id: number;
  url: string;
  publicId: string;
  propertyId: number;
  createdAt: string;
  updatedAt: string;
}
export interface PropertyFeature {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface PropertyType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export type SimilarPropertyData = {
  id: number;
  name: string;
  county: string;
  images: ImageData[];
  bedrooms:number;
  size:string;
  saleType:string;
  price:number;
  propertyType: PropertyType;
}
export interface PropertyData {
  id: number;
  name: string;
  description: string;
  streetAddress: string;
  city: string;
  area: string;
  state: string;
  country: string;
  county: string;
  latitude: string;
  longitude: string;
  saleType: string;
  featured: boolean;
  propertyTypeId: number;
  size: string;
  distance: string;
  price: number;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
  updatedAt: string;
  propertyToFeatures: PropertyFeature[];
  propertyType: PropertyType;
}

export interface PropertyResponse {
  status: string;
  data: {
    property: PropertyData;
    images: ImageData[];
  };
}

export interface SimilarProperty {
  status: string;
  data: SimilarPropertyData[]
}


export default function PropertyDetail({
  property,
  similarproperties
}: {
  property: PropertyResponse;
  similarproperties: SimilarProperty
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const position: [number, number] = [-1.2345, 36.80271]; // Latitude and Longitude for Runda, Nairobi
  const [isGridView, setIsGridView] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // console.log(similarproperties)

  const images = Array.isArray(property?.data?.images) ? property.data.images.map((image: any) => image.url) : [];


  // const features = [
  //   { icon: "CCTV", label: "24 Hour CCTV" },
  //   { icon: "Generator", label: "Backup Generator" },
  //   { icon: "Balcony", label: "Balcony" },
  //   { icon: "Water", label: "Borehole Water" },
  //   { icon: "Gym", label: "Gym" },
  //   { icon: "Intercom", label: "Intercom" },
  //   { icon: "Lift", label: "Lift" },
  //   { icon: "Parking", label: "Parking" },
  //   { icon: "Pool", label: "Swimming Pool" },
  // ];

  const features = property?.data?.property?.propertyToFeatures || [];
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const property1 = {
    id: 1,
    title: "2 Bedroom Apartment",
    price: 7900000,
    location: "Kilimani, Nairobi, Kenya",
    beds: 2,
    baths: 1,
    sqft: "80 sq m",
    type: "APARTMENT",
    featured: true,
    status: "FOR SALE",
    images: [
      "/1.jpg?height=300&width=400",
      "/2.jpg?height=300&width=400",
      "/3.jpg?height=300&width=400",
    ],
  };

  const handleShare = () => {
    const url = window.location.href; // You can replace this with the property URL you want to share
    if (navigator.share) {
      navigator
        .share({
          title: property?.data?.property?.name || "Property",
          text: `Check out this property: ${property?.data?.property?.name}`,
          url: url,
        })
        .then(() => setIsShared(true))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: Copy link to clipboard if sharing is not supported
      navigator.clipboard.writeText(url).then(() => {
        setIsShared(true);
        toast.success("Link copied to clipboard!");
      });
    }
  };

  return (
    <div className="mx-auto ">
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 px-4 py-8 container">
        <div className="space-y-6">
          {/* Header */}
          {property?.data?.property && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {property.data.property.featured && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    FEATURED
                  </Badge>
                )}
                <Badge variant="secondary">
                  {property.data.property.saleType}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">
                {property.data.property.name}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {`${property.data.property.streetAddress}, ${property.data.property.city}, ${property.data.property.state}, ${property.data.property.country}`}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  From{" "}
                  <span className="text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "KES",
                    }).format(property.data.property.price)}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  {isSharing ? "Sharing..." : "Share"}
                </Button>
                {/* {isShared && (
                  <span className="text-green-500">Link Shared!</span>
                )} */}
              </div>
            </div>
          )}

          {/* Image Gallery */}
          <div className="space-y-2">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-video cursor-pointer group">
                  <Image
                    src={images[selectedImage]}
                    alt="Property"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    <Camera className="w-4 h-4 inline mr-2" />
                    View all photos
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-2 gap-2">
                  {images.map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      alt={`Property ${idx + 1}`}
                      width={400}
                      height={300}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Property Details */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Property Type
                    </p>
                    <p className="font-medium">{property?.data?.property?.propertyType?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">
                      {property?.data?.property?.bedrooms}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Square Meters
                    </p>
                    <p className="font-medium">
                      {property?.data?.property?.size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Intime Homes</h3>
                  <Button variant="link" className="h-auto p-0">
                    View Listings
                  </Button>
                </div>
              </div>
              <form className="space-y-4">
                <Input placeholder="Name" />
                <Input placeholder="Phone" />
                <Input placeholder="Email" />
                <Textarea
                  placeholder="Message"
                  defaultValue="Hello, I am interested in [2 and 3 Bedroom Apartments for Sale in Riverside]"
                />
                <Button className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* description and features */}
      <div className="grid md:grid-cols-2">
        <div className="bg-primary100/10  container">
          {/* Description */}
          <div className="space-y-4 my-10 px-4 py-8 ">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground">
              {property?.data?.property?.description}
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Prices:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{`${property?.data?.property?.bedrooms} Bedroom (${property?.data?.property?.size
                  }, ${property?.data?.property?.propertyToFeatures
                    ? "master en-suite"
                    : ""
                  }) -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(property?.data?.property.price)}`}</li>
                {/* <li>3 Bedroom (DSQ/168 sqm) - KSh 20.5M</li> */}
              </ul>
            </div>
          </div>
          <div className="space-y-4 my-10 px-4 py-8">
            <h3 className="text-lg font-semibold">Details</h3>
            <div className="text-sm text-muted-foreground">
              Updated on{" "}
              {property?.data?.property.updatedAt
                ? new Date(property?.data?.property?.updatedAt).toLocaleString()
                : "N/A"}
            </div>
            <div className="grid gap-4 rounded-lg bg-muted p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Price:</div>
                  <div className="text-2xl font-bold">
                    {property?.data?.property?.price
                      ? `${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                      }).format(property?.data?.property.price)}`
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Property Type:</div>
                  <div>{property?.data?.property?.propertyType?.name || "N/A"}</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Bedrooms:</div>
                  <div>{property?.data?.property?.bedrooms || "N/A"}</div>
                </div>
                <div>
                  <div className="font-medium">Property Status:</div>
                  <div>{property?.data?.property?.saleType || "N/A"}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">Bathrooms:</div>
                <div>{property?.data?.property?.bathrooms || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary50/90 px-4 py-8 md:container">
          {/* Features */}
          <div className="space-y-4 bg-secondary50/90 my-10 p-4">
            <h2 className="text-2xl font-semibold">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature?.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* address and maps */}
        <div className="md:container bg-secondary50/90">
          <Card className="border-none bg-transparent shadow-none md:px-4 md:py-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Address</CardTitle>
              <Button
                variant="secondary"
                onClick={() => {
                  const { city, area, county, country, latitude, longitude } =
                    property?.data?.property || {};
                  const address = `${city}, ${area}, ${county}, ${country}`;
                  const mapsUrl =
                    latitude && longitude
                      ? `https://www.google.com/maps?q=${latitude},${longitude}`
                      : `https://www.google.com/maps/search/?q=${address}`;

                  window.open(mapsUrl, "_blank");
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open on Google Maps
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      City
                    </div>
                    <div>{property?.data?.property?.city}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Area
                    </div>
                    <div>{property?.data?.property?.area}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      State/county
                    </div>
                    <div>{property?.data?.property?.county}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Country
                    </div>
                    <div>{property?.data?.property?.country}</div>
                  </div>
                </div>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </div>

        <div className="bg-white overflow-hidden z-20">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>A property in Runda, Nairobi</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* similar listings */}
      <div className="bg-white my-10">
        <div className="px-4 py-8 container">
          <h3 className="text-3xl font-semibold my-6">Similar Listings</h3>
          
        </div>
      </div>
    </div>
  );
}
