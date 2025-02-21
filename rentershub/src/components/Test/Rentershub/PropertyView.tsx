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
import { getSession } from "next-auth/react"
import { baseUrl } from "@/utils/constants"
import axios from "axios"

interface Feature {
  id: number
  name: string
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
  size: number
  bedrooms: number
  bathrooms: number
  parking_spaces: number
  is_available: boolean
  is_approved: boolean
  featured: boolean
  rent_price: string
  deposit_amount: string
  main_image_url: {id:number,url: string}
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
  propertytype:{id:number, name:string};
  property_features: Feature[]
}

export default function PropertyDetails({
  id,
  title,
  description,
  propertytype,
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
  property_features,
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
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>(property_features.map((f) => f.id))
  const [featureList, setFeatureList] = useState<Feature[]>(property_features)
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
    size,
    bedrooms,
    bathrooms,
    parking_spaces,
    main_image_url,
    property_features,
  })

  console.log(formData, "data ya form")

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const session = await getSession();
        if (!session?.user?.accessToken) throw new Error("User not authenticated");
  
        const response = await axios.put(
          `${baseUrl}listing/property/${id}/`, 
          formData,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(formData, "form data")
        if (response.status === 200) {
          console.log("Property updated successfully", response.data);
        } else {
          console.error("Failed to update property", response);
        }
      } catch (error) {
        console.error("Error updating property:", error);
      }
    }
    setIsEditing(!isEditing);
  };
  

  const handleDelete = async (id: any) => {
    console.log("Delete property", id);
    setIsDeleteDialogOpen(false);
  
    try {
      const session = await getSession();
      const userId = session?.user?.user_id;
  
      if (!userId) {
        throw new Error("User ID not found in session");
      }
  
      const response = await axios.delete(`${baseUrl}listing/property/${id}/`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
  
      if (response.status === 204) {
        console.log("Property deleted successfully");
        setProperties((prevProperties) =>
          prevProperties.filter((property: { id: number }) => property.id !== id)
        ); // Remove deleted property from the list
      } else {
        console.log("Failed to delete property", response);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          main_image_url: { id: Date.now(), url: reader.result as string },
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  const onFeatureToggle = (featureId: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const renderEditableInput = (
    name: string,
    value: string | number,
    label: string,
    unit?: string,
    icon?: React.ReactNode,
  ) => {
    return (
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
        {icon}
        <div className="text-sm flex-1">
          <label htmlFor={name} className="text-muted-foreground">
            {label}
          </label>
          {isEditing ? (
            <div className="flex items-center mt-1">
              <Input id={name} name={name} value={value} onChange={handleInputChange} className="w-full" />
              {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
            </div>
          ) : (
            <div className="flex items-center mt-1">
              <span>{value}</span>
              {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
            </div>
          )}
        </div>
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
              {is_approved && <Badge >Approved</Badge>}
              {/* {featured && <Badge>Featured</Badge>} */}
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
                src={formData?.main_image_url?.url || "/placeholder.svg"}
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
                  <span className="text-sm">{formData?.propertytype?.name || "Not specified"}</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Description</h3>
          {isEditing ? (
            <Textarea
              name="description"
              value={formData?.description}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-sm text-black">{description}</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureList.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => onFeatureToggle(feature.id)}
                  disabled={!isEditing}
                />
                <label
                  htmlFor={`feature-${feature.id}`}
                  className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {feature.name}
                </label>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-4">
              <Input
                placeholder="Add new feature"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const newFeature = { id: featureList.length + 1, name: e.currentTarget.value }
                    setFeatureList([...featureList, newFeature])
                    setSelectedFeatures([...selectedFeatures, newFeature.id])
                    e.currentTarget.value = ""
                  }
                }}
              />
            </div>
          )}

          {selectedFeatures.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-primary">Selected Features:</h4>
              {featureList
                .filter((feature) => selectedFeatures.includes(feature.id))
                .map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between text-sm text-black">
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      {feature.name}
                    </span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFeatureList(featureList.filter((f) => f.id !== feature.id))
                          setSelectedFeatures(selectedFeatures.filter((id) => id !== feature.id))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-3">Pricing</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {renderEditableInput(
              "price",
              formData.price,
              "Price",
              undefined,
              <DollarSign className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "rent_price",
              formData.rent_price,
              "Rent",
              "/month",
              <DollarSign className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "deposit_amount",
              formData.deposit_amount,
              "Deposit",
              undefined,
              <DollarSign className="w-5 h-5 text-muted-foreground" />,
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Additional Charges</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderEditableInput(
              "water_charges",
              formData.water_charges,
              "Water",
              undefined,
              <Droplet className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "water_deposit",
              formData.water_deposit,
              "Water Deposit",
              undefined,
              <Droplet className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "garbage_charges",
              formData.garbage_charges,
              "Garbage",
              undefined,
              <Trash2 className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "security_charges",
              formData.security_charges,
              "Security",
              undefined,
              <Shield className="w-5 h-5 text-muted-foreground" />,
            )}
            {renderEditableInput(
              "other_charges",
              formData.other_charges,
              "Other",
              undefined,
              <DollarSign className="w-5 h-5 text-muted-foreground" />,
            )}
          </div>
        </div>

        <div>
  <h3 className="font-semibold mb-3">Property Images</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[main_image_url, ...images].filter(Boolean).map((image, index) => {
      const src = typeof image === "string" ? image : image.url;
      return (
        <div key={index} className="relative aspect-square">
          <Image
            src={src || "/placeholder.svg"}
            alt={`Property image ${index + 1}`}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      );
    })}
  </div>
</div>


        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">Managed by: {managed_by}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function setProperties(arg0: (prevProperties: any) => any) {
  throw new Error("Function not implemented.")
}

