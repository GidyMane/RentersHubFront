"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useFormik } from "formik"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Autocomplete from "react-google-autocomplete"
import * as Yup from "yup"
import { FileUploadZone } from "@/components/Test/Rentershub/FileUploadZone"
import { PropertyFeatures } from "@/components/Test/Rentershub/PropertyFeatures"
import { SuccessModal } from "@/components/Test/Rentershub/SuccessModal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { baseUrl } from "@/utils/constants"
import { useEdgeStore } from "@/lib/edgestore"
import { Home, Trash2, ImageIcon, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import { PlacesAutocomplete } from "../GoogleAutoCompletePlaces"

declare global {
  interface Window {
    google: any
  }
}

export default function AddPropertyPage({ GOOGLE_MAPS_API_KEY }: { GOOGLE_MAPS_API_KEY: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const [houseTypes, setHouseTypes] = useState<{ id: number; name: string }[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [uploadedFiles, setUploadedFiles] = useState<{
    coverImage?: string
    otherMedia: string[]
    coverImageLoading?: boolean
    otherMediaLoading?: boolean
    uploadProgress?: number
  }>({
    otherMedia: [],
    coverImageLoading: false,
    otherMediaLoading: false,
    uploadProgress: 0,
  })
  const { edgestore } = useEdgeStore()

  const COUNTIES = [
    "Baringo",
    "Bomet",
    "Bungoma",
    "Busia",
    "Elgeyo Marakwet",
    "Embu",
    "Garissa",
    "Homa Bay",
    "Isiolo",
    "Kajiado",
    "Kakamega",
    "Kericho",
    "Kiambu",
    "Kilifi",
    "Kirinyaga",
    "Kisii",
    "Kisumu",
    "Kitui",
    "Kwale",
    "Laikipia",
    "Lamu",
    "Machakos",
    "Makueni",
    "Mandera",
    "Marsabit",
    "Meru",
    "Migori",
    "Mombasa",
    "Murang'a",
    "Nairobi City",
    "Nakuru",
    "Nandi",
    "Narok",
    "Nyamira",
    "Nyandarua",
    "Nyeri",
    "Samburu",
    "Siaya",
    "Taita Taveta",
    "Tana River",
    "Tharaka Nithi",
    "Trans Nzoia",
    "Turkana",
    "Uasin Gishu",
    "Vihiga",
    "Wajir",
    "West Pokot",
  ]

  useEffect(() => {
    if (!session?.user.accessToken) {
      console.error("Session is not available.")
      return
    }

    const fetchHouseTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}listing/propertytype`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

        if (!response.ok) {
          const errorDetails = await response.text()
          throw new Error(`Failed to fetch house types: ${response.status}, ${errorDetails}`)
        }

        const data = await response.json()
        setHouseTypes(
          data.results.map((type: { id: number; name: string }) => ({
            id: type.id,
            name: type.name,
          })),
        )
      } catch (error) {
        console.error("Error fetching house types:", error)
        toast.error("Failed to load house types. Please refresh the page.")
      }
    }

    fetchHouseTypes()
  }, [session?.user.accessToken])

  const handleFilesSelected = async (files: File[], isCoverImage: boolean) => {
    const validTypes = isCoverImage
      ? ["image/jpeg", "image/png", "image/jpg"]
      : ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/webm"]

    const validFiles = files.filter((file) => validTypes.includes(file.type))

    if (validFiles.length !== files.length) {
      toast.warning("Some files have invalid types and will not be uploaded.")
    }

    const uploadedUrls: string[] = []

    setUploadedFiles((prev) => ({
      ...prev,
      ...(isCoverImage ? { coverImageLoading: true } : { otherMediaLoading: true }),
      uploadProgress: 0,
    }))

    for (const file of validFiles) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setUploadedFiles((prev) => ({
              ...prev,
              uploadProgress: progress,
            }))
          },
        })
        console.log(res, "response from edgestore")
        uploadedUrls.push(res.url)
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploadedFiles((prev) => ({
      ...prev,
      ...(isCoverImage
        ? { coverImage: uploadedUrls[0], coverImageLoading: false }
        : { otherMedia: [...prev.otherMedia, ...uploadedUrls], otherMediaLoading: false }),
      uploadProgress: 100,
    }))
  }

  type FeatureId = number

  const handlePlaceSelect = (place: google.maps.places.PlaceResult, formik: any) => {
    if (!place || !place.address_components) return

    let county = ""
    let city = ""
    let postalCode = ""
    let state = ""

    place.address_components.forEach((component) => {
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name
      }
      if (component.types.includes("administrative_area_level_2")) {
        county = component.long_name
      }
      if (component.types.includes("locality")) {
        city = component.long_name
      }
      if (component.types.includes("postal_code")) {
        postalCode = component.long_name
      }
    })

    if (!county) {
      county = state
    }

    formik.setFieldValue("location", place.formatted_address || "")
    formik.setFieldValue("county", county)
    formik.setFieldValue("city", city)
    formik.setFieldValue("poBox", postalCode)
    formik.setFieldValue("state", state)
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      features: [] as number[],
      houseType: "",
      county: "",
      city: "",
      poBox: "",
      location: "",
      managedBy: "",
      phone: "",
      state: "",
      rent: "",
      deposit: "",
      garbageFees: "",
      securityFees: "",
      waterCharges: "",
      waterDeposit: "",
      otherFees: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      houseType: Yup.string().required("House type is required"),
      managedBy: Yup.string().required("Manager is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits, no country code")
        .required("Phone number is required"),
      rent: Yup.number().required("Rent price is required").positive("Rent must be a positive value"),
      deposit: Yup.number().required("Deposit amount is required").positive("Deposit must be a positive value"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      if (!uploadedFiles.coverImage) {
        toast.error("Please upload a cover image before submitting.")
        return
      }

      setIsSubmitting(true)

      try {
        const formattedData = {
          title: values.title,
          description: values.description,
          property_type: values.houseType,
          price: "0",
          city: values.city || "Unknown City",
          state: values.state || values.county,
          owners_contact: values.phone,
          country: "Kenya",
          postal_code: values.poBox || "00000",
          address: values.location,
          features: values.features,
          amenities: [],
          water_charges: Number.parseFloat(values.waterCharges || "0"),
          garbage_charges: Number.parseFloat(values.garbageFees || "0"),
          security_charges: Number.parseFloat(values.securityFees || "0"),
          other_charges: Number.parseFloat(values.otherFees || "0"),
          water_deposit: Number.parseFloat(values.waterDeposit || "0"),
          is_available: true,
          is_approved: false,
          featured: true,
          rent_price: Number.parseFloat(values.rent),
          deposit_amount: Number.parseFloat(values.deposit),
          main_image_url: uploadedFiles.coverImage ? { id: "main-image", url: uploadedFiles.coverImage } : null,
          images: (uploadedFiles.otherMedia || []).map((url, idx) => ({
            id: `img-${idx + 1}`,
            url,
          })),
          posted_by: session?.user?.user_id,
          managed_by: values.managedBy,
        }

        console.log(formattedData, "data")

        const response = await fetch(`${baseUrl}listing/property`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(formattedData),
        })

        console.log(response, "res")

        if (!response.ok) {
          const errorDetails = await response.text()
          throw new Error(`Failed to create property: ${response.status}, ${errorDetails}`)
        }

        const responseData = await response.json()
        toast.success("Property created successfully!")

        setIsSuccessModalOpen(true)
       // Delay navigation to ensure modal is visible
setTimeout(() => {
  router.push("/rentershub/properties")
}, 3000) 
      } catch (error) {
        console.error("Error submitting property:", error)
        toast.error("Error submitting property. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleFeatureToggle = (featureId: FeatureId) => {
    const updatedFeatures = formik.values.features.includes(featureId)
      ? formik.values.features.filter((id) => id !== featureId)
      : [...formik.values.features, featureId]

    formik.setFieldValue("features", updatedFeatures)
  }

  // Check if a field has an error
  const hasError = (fieldName: string) => {
    return (
      formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors]
    )
  }

  // Get error message for a field
  const getErrorMessage = (fieldName: string) => {
    return formik.errors[fieldName as keyof typeof formik.errors]
  }

  // Function to move to next tab
  const moveToNextTab = (currentTab: string) => {
    if (currentTab === "basic") setActiveTab("location")
    else if (currentTab === "location") setActiveTab("financial")
    else if (currentTab === "financial") setActiveTab("features")
    else if (currentTab === "features") setActiveTab("media")
  }

  // Function to move to previous tab
  const moveToPrevTab = (currentTab: string) => {
    if (currentTab === "location") setActiveTab("basic")
    else if (currentTab === "financial") setActiveTab("location")
    else if (currentTab === "features") setActiveTab("financial")
    else if (currentTab === "media") setActiveTab("features")
  }

  return (
    <div className="bg-gray-50 min-h-screen p-3 sm:p-2" style={{ fontFamily: "Georgia, serif" }}>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 border-b">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
            <Home className="mr-2 h-6 w-6" /> Add New Property
          </h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your property</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 sm:px-6 pt-4">
            <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="basic"
                className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md flex flex-col items-center gap-1"
              >
                <span className="hidden sm:inline">Basic Info</span>
                <span className="sm:hidden">1</span>
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md flex flex-col items-center gap-1"
              >
                <span className="hidden sm:inline">Location</span>
                <span className="sm:hidden">2</span>
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md flex flex-col items-center gap-1"
              >
                <span className="hidden sm:inline">Financial</span>
                <span className="sm:hidden">3</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md flex flex-col items-center gap-1"
              >
                <span className="hidden sm:inline">Features</span>
                <span className="sm:hidden">4</span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md flex flex-col items-center gap-1"
              >
                <span className="hidden sm:inline">Media</span>
                <span className="sm:hidden">5</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6">
            <TabsContent value="basic" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-base font-medium flex items-center">
                    <span className="mr-1 text-primary">*</span> Property Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., TWO BEDROOM APARTMENTS TO LET IN KARATINA TOWN"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 h-12 relative z-[1] text-base ${hasError("title") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {hasError("title") && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("title")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="houseType" className="text-base font-medium flex items-center">
                    <span className="mr-1 text-primary">*</span> House Type
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedType = houseTypes.find((type) => type.id.toString() === value)
                      formik.setFieldValue("houseType", selectedType ? selectedType.id : "")
                    }}
                  >
                    <SelectTrigger
                      className={`mt-1 h-12 text-base relative z-[1] ${hasError("houseType") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select house type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {houseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()} className="text-base py-3">
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasError("houseType") && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("houseType")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium flex items-center">
                    <span className="mr-1 text-primary">*</span> Property Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Write something about the vacant house..."
                    className={`mt-1 min-h-[120px] text-base ${hasError("description") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {hasError("description") && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("description")}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => moveToNextTab("basic")}
                    className="bg-primary hover:bg-primary/90 h-12 px-6 text-base"
                  >
                    Next: Location
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Property Location
                  </Label>
                  <div className="mt-1">
                    <Input type="text" name="location" onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue={formik.values.location} id="" />
                     {/* <PlacesAutocomplete GOOGLE_MAPS_API_KEY={api_key}  />
                    <Autocomplete
                      apiKey={GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        console.log(place, "place")
                        handlePlaceSelect(place, formik)
                      }}
                      
                      options={{ types: ["geocode"], componentRestrictions: { country: "KE" } }}
                      className="w-full px-4 py-3 border rounded-md text-base h-12"
                      placeholder="Search for location"
                    /> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">
                      City/Town
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g., Nairobi"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 h-12 text-base relative z-[1]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="county" className="text-base font-medium">
                      County
                    </Label>
                    <Select onValueChange={(value) => formik.setFieldValue("county", value)}>
                      <SelectTrigger className="mt-1 h-12 text-base relative z-[1]">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COUNTIES.map((county) => (
                          <SelectItem key={county} value={county} className="text-base py-3">
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* <div>
                  <Label htmlFor="poBox" className="text-base font-medium">
                    P.O. Box
                  </Label>
                  <Input
                    id="poBox"
                    name="poBox"
                    placeholder="e.g., 0100"
                    value={formik.values.poBox}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 h-12 text-base relative z-[1]"
                  />
                </div> */}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => moveToPrevTab("location")}
                    className="h-12 px-6 text-base"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveToNextTab("location")}
                    className="bg-primary hover:bg-primary/90 h-12 px-6 text-base"
                  >
                    Next: Financial
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-4 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="managedBy" className="text-base font-medium flex items-center">
                      <span className="mr-1 text-primary">*</span> Managed By
                    </Label>
                    <Input
                      id="managedBy"
                      name="managedBy"
                      placeholder="Landlord's name or Agency's name"
                      value={formik.values.managedBy}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 h-12 text-base relative z-[1] ${hasError("managedBy") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {hasError("managedBy") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("managedBy")}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium flex items-center">
                      <span className="mr-1 text-primary">*</span> Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 h-12 text-base relative z-[1] ${hasError("phone") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {hasError("phone") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("phone")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rent" className="text-base font-medium flex items-center">
                      <span className="mr-1 text-primary">*</span> Rent Price Per Month
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="rent"
                        name="rent"
                        placeholder="e.g., 15,000"
                        type="number"
                        value={formik.values.rent}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`pl-12 h-12 text-base relative z-[1] ${hasError("rent") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {hasError("rent") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("rent")}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="deposit" className="text-base font-medium flex items-center">
                      <span className="mr-1 text-primary">*</span> Deposit Amount
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="deposit"
                        name="deposit"
                        placeholder="e.g., 10,000"
                        type="number"
                        value={formik.values.deposit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`pl-12 h-12 text-base relative z-[1] ${hasError("deposit") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                    {hasError("deposit") && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" /> {getErrorMessage("deposit")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="garbageFees" className="text-base font-medium">
                      Garbage Fees
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="garbageFees"
                        name="garbageFees"
                        placeholder="e.g., 500"
                        type="number"
                        value={formik.values.garbageFees}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-12 h-12 text-base relative z-[1]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="securityFees" className="text-base font-medium">
                      Security Fees
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="securityFees"
                        name="securityFees"
                        placeholder="e.g., 1,000"
                        type="number"
                        value={formik.values.securityFees}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-12 h-12 text-base relative z-[1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="waterCharges" className="text-base font-medium">
                      Water Charges/Unit/PM
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="waterCharges"
                        name="waterCharges"
                        placeholder="e.g., 200"
                        type="number"
                        value={formik.values.waterCharges}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-12 h-12 text-base relative z-[1]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="waterDeposit" className="text-base font-medium">
                      Water Deposit
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        KSh
                      </span>
                      <Input
                        id="waterDeposit"
                        name="waterDeposit"
                        placeholder="e.g., 2,000"
                        type="number"
                        value={formik.values.waterDeposit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-12 h-12 text-base relative z-[1]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="otherFees" className="text-base font-medium">
                    Other Fees
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      KSh
                    </span>
                    <Input
                      id="otherFees"
                      name="otherFees"
                      placeholder="e.g., 500"
                      type="number"
                      value={formik.values.otherFees}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-12 h-12 text-base relative z-[1]"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => moveToPrevTab("financial")}
                    className="h-12 px-6 text-base"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveToNextTab("financial")}
                    className="bg-primary hover:bg-primary/90 h-12 px-6 text-base"
                  >
                    Next: Features
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-4 space-y-6">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-primary mb-4">Property Features</h3>
                  <p className="text-gray-500 mb-4">Please select all the features that apply to your property</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <PropertyFeatures selectedFeatures={formik.values.features} onFeatureToggle={handleFeatureToggle} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => moveToPrevTab("features")}
                  className="h-12 px-6 text-base"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => moveToNextTab("features")}
                  className="bg-primary hover:bg-primary/90 h-12 px-6 text-base"
                >
                  Next: Media
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-4 space-y-6">
              <div className="space-y-6">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5" /> Cover Image <span className="text-red-500 ml-1">*</span>
                    </h3>
                    <p className="text-gray-500 mb-4">This will be the main image displayed for your property</p>

                    {!uploadedFiles.coverImage ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileUploadZone
                          onFilesSelected={(files) => {
                            if (files.length === 1) {
                              handleFilesSelected(files, true)
                            } else {
                              toast.warning("You can only upload one cover image.")
                            }
                          }}
                        />
                        {uploadedFiles.coverImageLoading && (
                          <div className="mt-4 flex items-center justify-center text-blue-600">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Uploading... {uploadedFiles.uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={uploadedFiles.coverImage || "/placeholder.svg"}
                          alt="Cover"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => setUploadedFiles((prev) => ({ ...prev, coverImage: "" }))}
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" /> Remove Image
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Cover Image Set
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                      <Upload className="mr-2 h-5 w-5" /> Additional Images & Videos
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload as many images and videos as possible to showcase your property
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileUploadZone onFilesSelected={(files) => handleFilesSelected(files, false)} />

                      {uploadedFiles.otherMediaLoading && (
                        <div className="mt-4 flex items-center justify-center text-blue-600">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Uploading... {uploadedFiles.uploadProgress}%</span>
                        </div>
                      )}
                    </div>

                    {uploadedFiles.otherMedia.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Uploaded Media ({uploadedFiles.otherMedia.length})</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {uploadedFiles.otherMedia.map((url, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden shadow-md border">
                              {url.endsWith(".mp4") ? (
                                <video src={url} controls className="w-full h-32 object-cover" />
                              ) : (
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Media ${idx}`}
                                  className="w-full h-32 object-cover"
                                />
                              )}

                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity">
                                <button
                                  onClick={() =>
                                    setUploadedFiles((prev) => ({
                                      ...prev,
                                      otherMedia: prev.otherMedia.filter((_, i) => i !== idx),
                                    }))
                                  }
                                  className="hidden group-hover:flex bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md hover:bg-red-600 transition items-center"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" /> Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => moveToPrevTab("media")}
                    className="h-12 px-6 text-base"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 h-12 px-6 text-base flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>Upload Property</>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false)
          router.push("/rentershub/properties")
        }}
      />

      <ToastContainer position="bottom-right" />
    </div>
  )
}

