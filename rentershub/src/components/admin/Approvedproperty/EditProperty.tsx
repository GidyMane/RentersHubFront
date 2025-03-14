"use client"

import { updateProperty } from "@/actions/properties"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { clearEditData } from "@/store/slices/PropertySlice"
import { useMutation } from "@tanstack/react-query"
import { useFormik } from "formik"
import { ArrowLeft, Building2, Check, Ellipsis, Home, ImageIcon, Info, MapPin, Plus, Wallet, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import * as Yup from "yup"

const EditProperty = () => {
  const editdata = useAppSelector((state) => state.property.editdata)
  const dispatch = useAppDispatch()
  const [uploadedFiles, setUploadedFiles] = useState({
    coverImage: "",
    otherMedia: [] as string[],
  })
  const [newFeature, setNewFeature] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      propertytype: { id: 0, name: "" },
      postedby: "",
      managed_by: "",
      address: "",
      city: "",
      state: "",
      county: "",
      phone: "",
      location: "",
      property_features: [] as { id: number; name: string; propertytype?: any }[],
      water_charges: "",
      garbage_charges: "",
      security_charges: "",
      other_charges: "",
      water_deposit: "",
      rent_price: "",
      deposit_amount: "",
      is_available: true,
      is_approved: false,
      main_image_url: { id: "", url: "" },
      images: [] as { id: string; url: string }[],
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      propertytype: Yup.object().shape({
        id: Yup.number(),
        name: Yup.string().required("Property type is required"),
      }),
      address: Yup.string().required("Address is required"),
      rent_price: Yup.string().required("Rent price is required"),
      managed_by: Yup.string().required("Manager information is required"),
    }),
    onSubmit(values) {
      console.log("Submitting values:", values)
      mutation.mutateAsync(values)
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      console.log("Mutation function called with:", values)
      const res = await updateProperty(values)
      console.log(res, "response")
      return res
    },
    onSuccess(data) {
      if (data[1] === 200) {
        toast.success("Property updated successfully")
        dispatch(clearEditData())
      } else {
        toast.error("Something went wrong!")
      }
    },
    onError(error: any) {
      toast.error(error.message)
    },
  })

  useEffect(() => {
    if (editdata) {
      // Set form values from editdata
      formik.setValues({
        id: editdata.id || 0,
        title: editdata.title || "",
        description: editdata.description || "",
        propertytype: {
          id: editdata.propertytype?.id || 0,
          name: editdata.propertytype?.name || "",
        },
        postedby: editdata.postedby || "",
        managed_by: editdata.managed_by || "",
        address: editdata.address || "",
        city: editdata.city || "",
        state: editdata.state || "",
        county: editdata.county || "",
        phone: editdata.owners_contact || "",
        location: editdata.address || "",
        property_features: editdata.property_features || [],
        water_charges: editdata.water_charges || "",
        garbage_charges: editdata.garbage_charges || "",
        security_charges: editdata.security_charges || "",
        other_charges: editdata.other_charges || "",
        water_deposit: editdata.water_deposit || "",
        rent_price: editdata.rent_price || "",
        deposit_amount: editdata.deposit_amount || "",
        is_available: editdata.is_available ?? true,
        is_approved: editdata.is_approved ?? false,
        main_image_url: editdata.main_image_url || { id: "", url: "" },
        images: editdata.images || [],
      })

      // Set uploaded files state
      if (editdata.main_image_url?.url) {
        setUploadedFiles((prev) => ({
          ...prev,
          coverImage: editdata.main_image_url.url,
        }))
      }

      if (editdata.images?.length > 0) {
        setUploadedFiles((prev) => ({
          ...prev,
          otherMedia: editdata.images.map((img: { url: string }) => img.url),
        }))
      }
    }
  }, [editdata])

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [
        ...formik.values.property_features,
        {
          id: Math.floor(Math.random() * -1000), // Temporary negative ID for new features
          name: newFeature,
          propertytype: null,
        },
      ]
      formik.setFieldValue("property_features", updatedFeatures)
      setNewFeature("")
      setHasUnsavedChanges(true)
    }
  }

  // Handle removing a feature
  const handleRemoveFeature = (index: number) => {
    const features = [...formik.values.property_features]
    features.splice(index, 1)
    formik.setFieldValue("property_features", features)
    setHasUnsavedChanges(true)
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <Button
          variant="ghost"
          className="flex items-center justify-center font-semibold"
          onClick={() => {
            dispatch(clearEditData())
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Media</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter property title"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-sm text-red-500">{formik.errors.title as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertytype.name">Property Type</Label>
                    <Input
                      id="propertytype.name"
                      name="propertytype.name"
                      value={formik.values.propertytype.name}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter property description"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postedby">Posted By</Label>
                    <Input
                      id="postedby"
                      name="postedby"
                      value={formik.values.postedby}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Posted by"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managed_by">Managed By</Label>
                    <Input
                      id="managed_by"
                      name="managed_by"
                      value={formik.values.managed_by}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Property manager"
                    />
                    {formik.touched.managed_by && formik.errors.managed_by && (
                      <p className="text-sm text-red-500">{formik.errors.managed_by as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Owner's Contact</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Contact phone number"
                    />
                  </div>

                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_available"
                        checked={formik.values.is_available}
                        onCheckedChange={(checked) => {
                          formik.setFieldValue("is_available", checked)
                        }}
                      />
                      <Label htmlFor="is_available">Property Available</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Information */}
          <TabsContent value="location" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter full address"
                      rows={2}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <p className="text-sm text-red-500">{formik.errors.address as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="State"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      name="county"
                      value={formik.values.county}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="County"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (for map)</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Location coordinates or address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-2">Property Features</h3>
                    {formik.values.property_features.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {formik.values.property_features.map((feature, index) => (
                          <div
                            key={feature.id || index}
                            className="flex items-center justify-between p-3 hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="h-8 w-8 rounded-full p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove {feature.name}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-24 bg-muted rounded-lg border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                          No features available. Add some features to highlight this property.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="new-feature">Add Feature</Label>
                      <Input
                        id="new-feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Enter a new feature"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={!newFeature.trim()}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent_price">Rent Price</Label>
                    <Input
                      id="rent_price"
                      name="rent_price"
                      value={formik.values.rent_price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Rent price"
                    />
                    {formik.touched.rent_price && formik.errors.rent_price && (
                      <p className="text-sm text-red-500">{formik.errors.rent_price as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit_amount">Deposit Amount</Label>
                    <Input
                      id="deposit_amount"
                      name="deposit_amount"
                      value={formik.values.deposit_amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Deposit amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water_charges">Water Charges</Label>
                    <Input
                      id="water_charges"
                      name="water_charges"
                      value={formik.values.water_charges}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Water charges"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="garbage_charges">Garbage Charges</Label>
                    <Input
                      id="garbage_charges"
                      name="garbage_charges"
                      value={formik.values.garbage_charges}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Garbage charges"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security_charges">Security Charges</Label>
                    <Input
                      id="security_charges"
                      name="security_charges"
                      value={formik.values.security_charges}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Security charges"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other_charges">Other Charges</Label>
                    <Input
                      id="other_charges"
                      name="other_charges"
                      value={formik.values.other_charges}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Other charges"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water_deposit">Water Deposit</Label>
                    <Input
                      id="water_deposit"
                      name="water_deposit"
                      value={formik.values.water_deposit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Water deposit"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cover Image</h3>
                    {uploadedFiles.coverImage ? (
                      <div className="relative w-full h-48 mb-2">
                        <Image
                          src={uploadedFiles.coverImage || "/placeholder.svg"}
                          alt="Cover image"
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No cover image available</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Property Images</h3>
                    {uploadedFiles.otherMedia.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedFiles.otherMedia.map((url, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Property image ${index + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-12 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No property images available</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={() => dispatch(clearEditData())}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending || !formik.isValid} className="bg-primary text-white">
            {mutation.isPending ? (
              <>
                <Ellipsis className="mr-2 h-4 w-4 animate-pulse" />
                Updating...
              </>
            ) : (
              "Update Property"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProperty

