"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, DollarSign, Droplet, Trash2, Shield, Edit, Check, MoreVertical, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface Feature {
  id: number
  name: string
}

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
  features: Feature[]
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
  id,
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
  images,
  water_charges,
  water_deposit,
  garbage_charges,
  security_charges,
  other_charges,
  managed_by,
  features,
}: PropertyDetails) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])
  const [formData, setFormData] = useState({
    title,
    description,
    price,
    rent_price,
    deposit_amount,
    water_charges,
    water_deposit,
    garbage_charges,
    security_charges,
    other_charges,
    size,
    bedrooms,
    bathrooms,
    parking_spaces,
    main_image_url,
  })

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      console.log("Saving changes", formData)
    }
    setIsEditing(!isEditing)
  }

  const handleDelete = () => {
    console.log("Delete property", id)
    setIsDeleteDialogOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, main_image_url: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const onFeatureToggle = (featureId: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const renderEditableInput = (name: string, value: string | number, label: string, unit?: string) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <label htmlFor={name} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {isEditing ? (
          <div className="flex items-center">
            <Input id={name} name={name} value={value} onChange={handleInputChange} className="w-full" />
            {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-sm">{value}</span>
            {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              {isEditing ? (
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-2xl font-bold"
                />
              ) : (
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </DropdownMenuItem>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this property?</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-muted-foreground mt-1">
              {address}, {city}, {state}, {country} {postal_code}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {is_available && <Badge variant="secondary">Available</Badge>}
              {is_approved && <Badge variant="secondary">Approved</Badge>}
              {featured && <Badge>Featured</Badge>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold mb-3">Main Image</h3>
            <div className="relative aspect-video">
              <Image
                src={formData.main_image_url || "/placeholder.svg"}
                alt={title}
                fill
                className="rounded-lg object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <label htmlFor="main-image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-white" />
                      <span className="text-white text-sm mt-2">Upload new image</span>
                    </div>
                    <input
                      id="main-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h3 className="font-semibold mb-2">Property Type</h3>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{property_type || "Not specified"}</span>
                </div>
              </div>
              <div className="col-span-1">{renderEditableInput("size", formData.size, "Size", "sq ft")}</div>
              <div className="col-span-1">{renderEditableInput("bedrooms", formData.bedrooms, "Bedrooms")}</div>
              <div className="col-span-1">{renderEditableInput("bathrooms", formData.bathrooms, "Bathrooms")}</div>
              <div className="col-span-1">
                {renderEditableInput("parking_spaces", formData.parking_spaces, "Parking Spaces")}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Description</h3>
          {isEditing ? (
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${feature.id}`}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => onFeatureToggle(feature.id)}
                  disabled={!isEditing}
                />
                <label
                  htmlFor={`${feature.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {feature.name}
                </label>
              </div>
            ))}
          </div>

          {selectedFeatures.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-primary">Selected Features:</h4>
              {features
                .filter((feature) => selectedFeatures.includes(feature.id))
                .map((feature) => (
                  <p key={feature.id} className="flex items-center text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    {feature.name}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Pricing</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Price</p>
                {renderEditableInput("price", formData.price, "Price")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Rent</p>
                {renderEditableInput("rent_price", formData.rent_price, "Rent")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Deposit</p>
                {renderEditableInput("deposit_amount", formData.deposit_amount, "Deposit")}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Additional Charges</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Droplet className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Water</p>
                {renderEditableInput("water_charges", formData.water_charges, "Water")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Droplet className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Water Deposit</p>
                {renderEditableInput("water_deposit", formData.water_deposit, "Water Deposit")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Garbage</p>
                {renderEditableInput("garbage_charges", formData.garbage_charges, "Garbage")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Security</p>
                {renderEditableInput("security_charges", formData.security_charges, "Security")}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div className="text-sm flex-1">
                <p className="text-muted-foreground">Other</p>
                {renderEditableInput("other_charges", formData.other_charges, "Other")}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Property Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[main_image_url, ...images].filter(Boolean).map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">Managed by: {managed_by}</span>
        </div>
      </CardContent>
    </Card>
  )
}

