"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Trash2, Shield, Edit, Save, X, Upload, MapPin, Plus, ImagePlus } from "lucide-react"
import { getSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "react-hot-toast"

interface Feature {
  id: number
  name: string
}

interface PropertyImage {
  id: string
  url: string
}

interface PropertyDetails {
  id: number
  title: string
  description: string
  price: string
  city: string
  state: string
  country: string
  postal_code: string
  address: string
  location: string | null
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  main_image_url: { id: number; url: string }
  images: PropertyImage[]
  features: Feature[]
  amenities: number[]
  water_charges: string
  water_deposit: string
  garbage_charges: string
  security_charges: string
  other_charges: string
  posted_by: number
  managed_by: string
  propertytype: { id: number; name: string }
  property_features: Feature[]
  onPropertyDeleted?: () => void
}

export default function PropertyDetails({
  id,
  title,
  description,
  propertytype,
  price,
  address,
  is_available,
  is_approved,
  featured,
  rent_price,
  deposit_amount,
  main_image_url,
  images,
  property_features,
  water_charges,
  water_deposit,
  garbage_charges,
  security_charges,
  other_charges,
  managed_by,
  features,
  onPropertyDeleted,
}: PropertyDetails) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>(property_features.map((f) => f.id))
  const [featureList, setFeatureList] = useState<Feature[]>(property_features)
  const [newFeature, setNewFeature] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [additionalImages, setAdditionalImages] = useState<PropertyImage[]>(images || [])

  const [formData, setFormData] = useState({
    title,
    description,
    price,
    rent_price,
    deposit_amount,
    water_charges,
    water_deposit,
    propertytype,
    garbage_charges,
    security_charges,
    other_charges,
    is_approved,
    images,
    main_image_url,
    property_features,
    is_available,
  })

  // Reset form data when property details change
  useEffect(() => {
    setFormData({
      title,
      description,
      price,
      rent_price,
      deposit_amount,
      water_charges,
      water_deposit,
      propertytype,
      garbage_charges,
      security_charges,
      other_charges,
      is_approved,
      images,
      main_image_url,
      property_features,
      is_available,
    })
    setSelectedFeatures(property_features.map((f) => f.id))
    setFeatureList(property_features)
    setAdditionalImages(images || [])
  }, [
    title,
    description,
    price,
    rent_price,
    deposit_amount,
    water_charges,
    water_deposit,
    propertytype,
    garbage_charges,
    security_charges,
    other_charges,
    is_approved,
    main_image_url,
    property_features,
    images,
    is_available,
  ])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const session = await getSession()
      if (!session?.user?.accessToken) throw new Error("User not authenticated")

      // Update property_features with selected features
      const updatedFormData = {
        ...formData,
        property_features: featureList.filter((f) => selectedFeatures.includes(f.id)),
      }
     
      
      const response = await axios.patch(`${baseUrl}listing/property/${id}/`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
          "Content-Type": "application/json",
        },
      })
      

      if (response.status === 200) {
        toast.success("Property updated successfully")
        setIsEditing(false)
      } else {
        toast.error("Failed to update property")
      }
    } catch (error) {
      console.error("Error updating property:", error)
      toast.error("An error occurred while updating the property")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const session = await getSession()
      if (!session?.user?.accessToken) {
        throw new Error("User not authenticated")
      }

      const response = await axios.delete(`${baseUrl}listing/property/${id}/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      })

      if (response.status === 204) {
        toast.success("Property deleted successfully")

        // Use the callback for navigation instead of window.location
        if (onPropertyDeleted) {
          onPropertyDeleted()
        } else {
          // Fallback if callback not provided
          router.push("/rentershub/properties")
        }
      } else {
        toast.error("Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      toast.error("An error occurred while deleting the property")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }))
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          main_image_url: { id: prev.main_image_url?.id || Date.now(), url: reader.result as string },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const newImage: PropertyImage = {
        id: crypto.randomUUID(), // Generate a unique ID
        url: reader.result as string, // Use the data URL for preview
      }

      setAdditionalImages((prev) => [...prev, newImage])
    }

    reader.readAsDataURL(file)
  }

  const removeAdditionalImage = (id: string) => {
    setAdditionalImages((prev) => prev.filter((image) => image.id !== id))
  }

  const addNewFeature = () => {
    if (newFeature.trim()) {
      const newFeatureObj = { id: Date.now(), name: newFeature.trim() }
      setFeatureList((prev) => [...prev, newFeatureObj])
      setSelectedFeatures((prev) => [...prev, newFeatureObj.id])
      setNewFeature("")
    }
  }

  const toggleAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      is_available: !prev.is_available,
    }))
  }

  const cancelEditing = () => {
    // Reset form data to original values
    setFormData({
      title,
      description,
      price,
      images,
      rent_price,
      deposit_amount,
      water_charges,
      water_deposit,
      propertytype,
      garbage_charges,
      security_charges,
      other_charges,
      is_approved,
      main_image_url,
      property_features,
      is_available,
    })
    setSelectedFeatures(property_features.map((f) => f.id))
    setFeatureList(property_features)
    setAdditionalImages(images || [])
    setIsEditing(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-background">
      {/* Hero Section with Main Image */}
      <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-b-xl overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={formData.main_image_url?.url || "/placeholder.svg?height=400&width=1200"}
            alt={formData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex gap-2 mb-3">
            <Badge
              className={`cursor-pointer text-white ${
                formData.is_approved ? "bg-green-500/90 hover:bg-green-500" : "bg-red-500/90 hover:bg-red-500"
              }`}
            >
              {formData.is_approved ? "Approved" : "Not Approved"}
            </Badge>

            {isEditing && (
              <Badge
                className={`cursor-pointer text-white ${
                  formData.is_available ? "bg-blue-500/90 hover:bg-blue-500" : "bg-gray-500/90 hover:bg-gray-500"
                }`}
                onClick={toggleAvailability}
              >
                {formData.is_available ? "Available" : "Not Available"}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isEditing ? (
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="text-2xl font-bold h-auto py-1 px-2 bg-black/30 border-white/30 text-white"
                placeholder="Property Title"
              />
            ) : (
              formData.title
            )}
          </h1>

          <div className="flex items-center text-white/90 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed position for easy access */}
      <div className="sticky top-0 z-10 bg-background border-b mb-6 py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-end items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={cancelEditing} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button variant="default" onClick={handleSave} disabled={isSaving} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit Property
              </Button>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the property and remove all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="details" className="text-sm md:text-base">
            Details
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-sm md:text-base">
            Pricing
          </TabsTrigger>
          <TabsTrigger value="images" className="text-sm md:text-base">
            Images
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-secondary">Property Type</span>
                      <span className="font-medium">{propertytype.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-secondary">Status</span>
                      <span className="font-medium">{formData.is_available ? "Available" : "Not Available"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-secondary">Managed By</span>
                      <span className="font-medium">{managed_by}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[150px]"
                      placeholder="Describe the property"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{formData.description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-lg font-semibold">Property Features</h3>
                {isEditing && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Add new feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="max-w-full sm:max-w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addNewFeature()
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addNewFeature}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featureList.map((feature) => (
                  <div
                    key={feature.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      selectedFeatures.includes(feature.id)
                        ? "border-primary/20 bg-primary/5"
                        : "border-muted bg-muted/20"
                    }`}
                  >
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => {
                        if (isEditing) {
                          setSelectedFeatures((prev) =>
                            prev.includes(feature.id) ? prev.filter((id) => id !== feature.id) : [...prev, feature.id],
                          )
                        }
                      }}
                      disabled={!isEditing}
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label
                      htmlFor={`feature-${feature.id}`}
                      className={`text-sm font-medium leading-none ml-2 ${
                        !isEditing && !selectedFeatures.includes(feature.id) ? "text-secondary line-through" : ""
                      }`}
                    >
                      {feature.name}
                    </label>
                    {isEditing && selectedFeatures.includes(feature.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-auto text-secondary hover:text-destructive"
                        onClick={() => {
                          setFeatureList((prev) => prev.filter((f) => f.id !== feature.id))
                          setSelectedFeatures((prev) => prev.filter((id) => id !== feature.id))
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">Main Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    {isEditing ? (
                      <Input name="price" value={formData.price} onChange={handleInputChange} className="flex-1" />
                    ) : (
                      <span className="font-medium">{formData.price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rent (monthly)</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    {isEditing ? (
                      <Input
                        name="rent_price"
                        value={formData.rent_price}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.rent_price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deposit</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    {isEditing ? (
                      <Input
                        name="deposit_amount"
                        value={formData.deposit_amount}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.deposit_amount}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">Additional Charges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Water Charges</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Droplet className="h-5 w-5 text-secondary" />
                    {isEditing ? (
                      <Input
                        name="water_charges"
                        value={formData.water_charges}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.water_charges}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Water Deposit</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Droplet className="h-5 w-5 text-secondary" />
                    {isEditing ? (
                      <Input
                        name="water_deposit"
                        value={formData.water_deposit}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.water_deposit}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Garbage Charges</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Trash2 className="h-5 w-5 text-secondary" />
                    {isEditing ? (
                      <Input
                        name="garbage_charges"
                        value={formData.garbage_charges}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.garbage_charges}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Security Charges</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    <Shield className="h-5 w-5 text-secondary" />
                    {isEditing ? (
                      <Input
                        name="security_charges"
                        value={formData.security_charges}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.security_charges}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Other Charges</label>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                    {isEditing ? (
                      <Input
                        name="other_charges"
                        value={formData.other_charges}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    ) : (
                      <span className="font-medium">{formData.other_charges}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ImagePlus className="h-5 w-5 mr-2 text-primary" />
                Main Image
              </h3>
              <div className="relative aspect-video max-w-2xl mx-auto overflow-hidden rounded-xl border">
                <Image
                  src={formData.main_image_url?.url || "/placeholder.svg?height=600&width=1200"}
                  alt={formData.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <label htmlFor="main-image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-white" />
                        <span className="text-white text-sm mt-2">Change main image</span>
                      </div>
                      <input
                        id="main-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleMainImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ImagePlus className="h-5 w-5 mr-2 text-primary" />
                  Property Gallery
                </h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    className="flex items-center gap-1"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Add Image
                  </Button>
                )}
              </div>

              {isEditing && showImageUpload && (
                <div className="mb-6 p-8 border border-dashed border-primary/40 rounded-xl flex flex-col items-center justify-center bg-muted/30">
                  <label htmlFor="additional-image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="w-10 h-10 text-primary/70" />
                      <span className="text-base font-medium mt-3">Upload additional image</span>
                      <span className="text-sm text-secondary mt-1">Click to browse files</span>
                    </div>
                    <input
                      id="additional-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAdditionalImageUpload}
                    />
                  </label>
                </div>
              )}

              {additionalImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {additionalImages.map((image) => (
                    <div key={image.id} className="relative aspect-square group overflow-hidden rounded-xl border">
                      <Image
                        src={image.url || "/placeholder.svg?height=300&width=300"}
                        alt="Property image"
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-9 w-9 rounded-full"
                                  onClick={() => removeAdditionalImage(image.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove image</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 bg-muted/30 rounded-xl">
                  <ImagePlus className="h-12 w-12 text-secondary/50 mx-auto mb-3" />
                  <p className="text-secondary font-medium">No additional images available</p>
                  {isEditing && (
                    <p className="text-sm text-secondary mt-2">
                      Click the "Add Image" button to upload property photos
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 mb-12 text-sm text-secondary bg-muted/30 p-4 rounded-lg text-center">
        <p>• Managed by: {managed_by}</p>
      </div>
    </div>
  )
}

