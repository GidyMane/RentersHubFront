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
  Cctv,
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
import CallLandlordForm from "./CallLandlord";
import ChatWithLandlord from "./ChatLandlord";
import ShareButton from "./ShareWhatsapp";



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
  title: string;
  propertytype:{id:number, name:string};
  updated_at: string;  
  description: string; 
  city: string;
  state: string;
  country: string;
  postal_code: string;
  address: string;
  location: string
  location_coords: string  
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  main_image_url:{id:string, url:string}
  images: []
  features: {id:number, name:string}
  water_charges: string
  water_deposit: string
  garbage_charges: string
  security_charges: string
  other_charges: string
  posted_by: number
  managed_by: string
  property_features: {id:number, name:string}

 


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

  // const images = Array.isArray(property?.data?.images) ? property.data.images.map((image: any) => image.url) : [];

  const images: string[] = [
    property?.main_image_url?.url ?? "", // Main image first
    ...(Array.isArray(property?.images) ? property.images.map((img: { url: string }) => img.url) : []),
  ].filter(Boolean); // Remove null/undefined/empty values
  

  // const features = Array.isArray(property?.property_features) ? property.property_features : [];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });



  const handleShare = () => {
    const url = window.location.href; // You can replace this with the property URL you want to share
    if (navigator.share) {
      navigator
        .share({
          title: property?.title || "Property",
          text: `Check out this property: ${property?.title}`,
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
          {property && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {property.featured && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    AVAILABLE
                  </Badge>
                )}
                <Badge variant="secondary">
                  {property?.is_available}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">
                {property.title}
              </h1>
              <div className="flex items-center text-muted">
                <MapPin className="w-4 h-4 mr-2" />
                {`${property.address}, ${property.city}, ${property.state}, ${property.country}`}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">
                  {" "}
                  <span className="text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "KES",
                    }).format(Number(property.rent_price))}
                  </span>
                </div>
                {/* <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  {isSharing ? "Sharing..." : "Share"}
                </Button> */}
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
        {images.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt="Property"
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-200 rounded-lg">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
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
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted" />
                  <div className="space-y-1">
                    <p className="text-sm text-secondary">
                      Property Type
                    </p>
                    <p className="font-medium">{property?.propertytype?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Cctv className="w-4 h-4 text-muted" />
                  <div className="space-y-1">
                    <p className="text-sm text-secondary">Managed By</p>
                    <p className="font-medium">
                      {property?.managed_by}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-muted" />
                  <div className="space-y-1">
                    <p className="text-sm text-secondary">
                      Square Meters
                    </p>
                    <p className="font-medium">
                      {property?.data?.property?.size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
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
                  <h3 className="font-semibold">RentersHub</h3>
                  <Button variant="link" className="h-auto p-0">
                    Connect with Us
                  </Button>
                </div>
              </div>
              <form className="space-y-4">
                {/* <Input placeholder="Name" />
                <Input placeholder="Phone" /> */}
                {/* <Input placeholder="Email" /> */}
                {/* <Textarea
                  placeholder="Message"
                  defaultValue="Hello. I have seen this vacant house on Renters Hub Platform. Is it still available?”"
                /> */}
                {/* <Button className="w-full bg-[#B5A887] hover:bg-[#A39775] text-white">
                  Send Message
                </Button> */}

                <CallLandlordForm landlordPhone={""}/>
                <ChatWithLandlord landlordPhone={""}/>
                {/* <ShareButton propertyLink={""}/> */}
                <ShareButton propertyLink={window.location.href}/>
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
            <p className="text-black">
              {property?.description}
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Prices:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>{`Rent Amount 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.rent_price))}`}</li>
                <li>{`Deposit Amount 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.deposit_amount))}`}</li>
                  <li>{`Water Charges 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.water_charges))}per unit`}</li>
                   <li>{`Water Deposit 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.water_deposit))}per unit`}</li>
                  <li>{`Garbage Changes 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.garbage_charges))}`}</li>
                  <li>{`Security Charges 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.security_charges))}`}</li>
                  <li>{`Other Charges 
                     -  ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "KES",
                  }).format(Number(property?.other_charges))}`}</li>  
              </ul>
            </div>
          </div>
          <div className="space-y-4 my-10 px-4 py-8">
            <h3 className="text-lg font-semibold">Details</h3>
            <div className="text-sm text-black">
              Updated on{" "}
              {property?.updated_at
                ? new Date(property?.updated_at).toLocaleString()
                : "N/A"}
            </div>
            <div className="grid gap-4 rounded-lg bg-white p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Price:</div>
                  <div className="text-2xl font-bold">
                    {property?.data?.property?.price
                      ? `${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                      }).format(Number(property?.rent_price))}`
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Property Type:</div>
                  <div>{property?.propertytype?.name || "N/A"}</div>
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
            {property?.property_features && Array.isArray(property.property_features) ? (
  <div className="grid grid-cols-1 gap-4">
    {property.property_features.map((feature) => (
      <div key={feature.id} className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span>{feature.name}</span>
      </div>
    ))}
  </div>
) : (
  <p>No features available</p>
)}
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
                    <div className="text-sm font-medium text-muted">
                      City
                    </div>
                    <div>{property?.city}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted">
                      Area
                    </div>
                    <div>{property?.address}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted">
                      State/county
                    </div>
                    <div>{property?.state}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted">
                      Country
                    </div>
                    <div>{property?.country}</div>
                  </div>
                </div>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </div>

        <div className="bg-secondary overflow-hidden z-20">
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
              <Popup>A property in {property?.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* similar listings */}
      <div className="bg-white my-10">
        <div className="px-4 py-8 container">
          <h3 className="text-3xl font-semibold my-6">Other Properties In the Same Area</h3>

          <p>No properties for now</p>
          
        </div>
      </div>
    </div>
  );
}
