'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from "react-google-autocomplete";

import * as Yup from 'yup';
import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout';
import { FileUploadZone } from '@/components/Test/Rentershub/FileUploadZone';
import { PropertyFeatures } from '@/components/Test/Rentershub/PropertyFeatures';
import { SuccessModal } from '@/components/Test/Rentershub/SuccessModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { baseUrl } from '@/utils/constants';
import { useEdgeStore } from '@/lib/edgestore';

export default function AddPropertyPage({GOOGLE_MAPS_API_KEY}:{GOOGLE_MAPS_API_KEY:string}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [houseTypes, setHouseTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    coverImage?: string;
    otherMedia: string[];
    coverImageLoading?: boolean;
    otherMediaLoading?: boolean;
    uploadProgress?: number;
  }>({
    otherMedia: [],
    coverImageLoading: false,
    otherMediaLoading: false,
    uploadProgress: 0,
  });
  const { edgestore } = useEdgeStore();

  const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang’a', 
  'Nairobi City', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 
  'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];




  useEffect(() => {
    if (!session?.user.accessToken) {
      console.error('Session is not available.');
      return;
    }


    
  


    const fetchHouseTypes = async () => { 
      try {
        const response = await fetch(`${baseUrl}listing/propertytype`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
    
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch house types: ${response.status}, ${errorDetails}`);
        }
    
        const data = await response.json();
        setHouseTypes(data.results.map((type: { id: number, name: string }) => ({
          id: type.id,
          name: type.name,
        })));
      } catch (error) {
        console.error('Error fetching house types:', error);
      }
    };
    

    fetchHouseTypes();
  }, [session?.user.accessToken]);

  const handleFilesSelected = async (files: File[], isCoverImage: boolean) => {
    const validTypes = isCoverImage
      ? ["image/jpeg", "image/png", "image/jpg"]
      : ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/webm"];
  
    const validFiles = files.filter((file) => validTypes.includes(file.type));
  
    if (validFiles.length !== files.length) {
      alert("Some files have invalid types and will not be uploaded.");
    }
  
    const uploadedUrls: string[] = [];
  
    setUploadedFiles((prev) => ({
      ...prev,
      ...(isCoverImage ? { coverImageLoading: true } : { otherMediaLoading: true }),
      uploadProgress: 0, // Reset progress before upload starts
    }));
  
    for (const file of validFiles) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setUploadedFiles((prev) => ({
              ...prev,
              uploadProgress: progress, // Update progress dynamically
            }));
          },
        });
  
        uploadedUrls.push(res.url);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
  
    setUploadedFiles((prev) => ({
      ...prev,
      ...(isCoverImage
        ? { coverImage: uploadedUrls[0], coverImageLoading: false }
        : { otherMedia: [...prev.otherMedia, ...uploadedUrls], otherMediaLoading: false }),
      uploadProgress: 100, // Ensure progress is complete
    }));
  };
  
  
  

  type FeatureId = number
  
  const handlePlaceSelect = (place: google.maps.places.PlaceResult, formik: any) => {
    if (!place || !place.address_components) return;
  
    let county = "";
    let city = "";
    let postalCode = "";
    let state = ""; // NEW: Add state field
  
    console.log("Address Components:", place.address_components);
  
    place.address_components.forEach((component) => {
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name; // State or main administrative region
      }
      if (component.types.includes("administrative_area_level_2")) {
        county = component.long_name; // County (if available)
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    });
  
    // If county is missing, fallback to state
    if (!county) {
      county = state;
    }
  
    // Update only location fields without overriding other form values
    formik.setFieldValue("location", place.formatted_address || "");
    formik.setFieldValue("county", county);
    formik.setFieldValue("city", city);
    formik.setFieldValue("poBox", postalCode);
    formik.setFieldValue("state", state); // NEW: Ensure state is captured
  };
  
  
  
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
          toast.error("Please upload a cover image before submitting.");
          return;
        }
  
        setIsSubmitting(true);
  
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
            water_charges: parseFloat(values.waterCharges || "0"),
            garbage_charges: parseFloat(values.garbageFees || "0"),
            security_charges: parseFloat(values.securityFees || "0"),
            other_charges: parseFloat(values.otherFees || "0"),
            water_deposit: parseFloat(values.waterDeposit || "0"),
            is_available: true,
            is_approved: true,
            featured: true,
            rent_price: parseFloat(values.rent),
            deposit_amount: parseFloat(values.deposit),
            main_image_url: uploadedFiles.coverImage ? { id: "main-image", url: uploadedFiles.coverImage } : null,
            images: (uploadedFiles.otherMedia || []).map((url, idx) => ({
              id: `img-${idx + 1}`,
              url,
            })),
            posted_by: session?.user?.user_id,
            managed_by: values.managedBy,
          };
  
          console.log("Formatted Data:", formattedData);
  
          const response = await fetch(`${baseUrl}listing/property`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: JSON.stringify(formattedData),
          });
  
          if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to create property: ${response.status}, ${errorDetails}`);
          }
  
          const responseData = await response.json();
          toast.success("Property created successfully:", responseData);
  
          setIsSuccessModalOpen(true);
          router.push("/rentershub/properties");
        } catch (error) {
          console.error("Error submitting property:", error);
          toast.error("Error submitting property. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  
  

  

  const handleFeatureToggle = (featureId: FeatureId) => {
    const updatedFeatures = formik.values.features.includes(featureId)
      ? formik.values.features.filter((id) => id !== featureId) // Remove feature ID
      : [...formik.values.features, featureId] // Add feature ID

    formik.setFieldValue('features', updatedFeatures)

    console.log(updatedFeatures, "Features to send to formik")
  }

  return (
    
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">Add New Property</h1>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., TWO BEDROOM APARTMENTS TO LET IN KARATINA TOWN"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-red-500 text-sm">{formik.errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="houseType">House Type</Label>
                    <Select
  onValueChange={(value) => {
    const selectedType = houseTypes.find((type) => type.id.toString() === value);
    formik.setFieldValue('houseType', selectedType ? selectedType.id : '');
  }}
  required
>
  <SelectTrigger>
    <SelectValue placeholder="Select house type" />
  </SelectTrigger>
  <SelectContent>
    {houseTypes.map((type) => (
      <SelectItem key={type.id} value={type.id.toString()}>
        {type.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                    {formik.touched.houseType && formik.errors.houseType && (
                      <p className="text-red-500 text-sm">{formik.errors.houseType}</p>
                    )}
                  </div>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label htmlFor="location">Location</label>
      <Autocomplete
        apiKey={GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => handlePlaceSelect(place, formik)}
        options={{ types: ["geocode"], componentRestrictions: { country: "KE" } }}
        className="w-full px-3 py-2 border rounded-lg"
      />
      {formik.touched.location && formik.errors.location && (
        <p className="text-red-500 text-sm">{formik.errors.location}</p>
      )}
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Nairobi"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-sm">{formik.errors.city}</p>
                )}
              </div>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                    <Label htmlFor="county">County</Label>
                    <Select
                      onValueChange={(value) => formik.setFieldValue('county', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.county && formik.errors.county && (
                      <p className="text-red-500 text-sm">{formik.errors.county}</p>
                    )}
                  </div>
                  <div>
                <Label htmlFor="postal_code">Po Box</Label>
                <Input
                  id="poBox"
                  name="poBox"
                  placeholder="e.g., 0100"
                  value={formik.values.poBox}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.poBox && formik.errors.poBox && (
                  <p className="text-red-500 text-sm">{formik.errors.poBox}</p>
                )}
              </div>
              </div>

                
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managedBy">Managed By</Label>
                <Input
                  id="managedBy"
                  name="managedBy"
                  placeholder="Landlord's name or Agency's name"
                  value={formik.values.managedBy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.managedBy && formik.errors.managedBy && (
                  <p className="text-red-500 text-sm">{formik.errors.managedBy}</p>
                )}
              </div>
              <div>
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    name="phone"
    type="tel"
    placeholder="Enter 10-digit number"
    value={formik.values.phone}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    required
  />
  {formik.touched.phone && formik.errors.phone && (
    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
  )}
</div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent">Rent Price Per Month</Label>
                <Input
                  id="rent"
                  name="rent"
                  placeholder="e.g., 15,000"
                  type="number"
                  value={formik.values.rent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.rent && formik.errors.rent && (
                  <p className="text-red-500 text-sm">{formik.errors.rent}</p>
                )}
              </div>
              <div>
                <Label htmlFor="deposit">Deposit Amount</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  placeholder="e.g., 10,000"
                  type="number"
                  value={formik.values.deposit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.deposit && formik.errors.deposit && (
                  <p className="text-red-500 text-sm">{formik.errors.deposit}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="garbageFees">Garbage Fees</Label>
                <Input
                  id="garbageFees"
                  name="garbageFees"
                  placeholder="e.g., 500"
                  type="number"
                  value={formik.values.garbageFees}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.garbageFees && formik.errors.garbageFees && (
                  <p className="text-red-500 text-sm">{formik.errors.garbageFees}</p>
                )}
              </div>
              <div>
                <Label htmlFor="securityFees">Security Fees</Label>
                <Input
                  id="securityFees"
                  name="securityFees"
                  placeholder="e.g., 1,000"
                  type="number"
                  value={formik.values.securityFees}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.securityFees && formik.errors.securityFees && (
                  <p className="text-red-500 text-sm">{formik.errors.securityFees}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterCharges">Water Charges/Unit/PM</Label>
                <Input
                  id="waterCharges"
                  name="waterCharges"
                  placeholder="e.g., 200"
                  type="number"
                  value={formik.values.waterCharges}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.waterCharges && formik.errors.waterCharges && (
                  <p className="text-red-500 text-sm">{formik.errors.waterCharges}</p>
                )}
              </div>
              <div>
                <Label htmlFor="waterDeposit">Water Deposit</Label>
                <Input
                  id="waterDeposit"
                  name="waterDeposit"
                  placeholder="e.g., 2,000"
                  type="number"
                  value={formik.values.waterDeposit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.waterDeposit && formik.errors.waterDeposit && (
                  <p className="text-red-500 text-sm">{formik.errors.waterDeposit}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Write something about the vacant house..."
                className="h-32"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>         
                           
              
            {/* Property Features */}
            <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#1C4532] mb-4">Property Features</h3>
          <PropertyFeatures
            selectedFeatures={formik.values.features} // Pass selected IDs
            onFeatureToggle={handleFeatureToggle} // Pass toggle handler
          />
          {formik.touched.features && formik.errors.features && (
            <p className="text-red-500 text-sm mt-2">{formik.errors.features}</p>
          )}
        </CardContent>
      </Card>

            {/* Cover Image */}
            <Card>
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold text-[#1C4532] mb-4">Cover Image</h3>

    {!uploadedFiles.coverImage ? (
      <>
        <FileUploadZone
          onFilesSelected={(files) => {
            if (files.length === 1) {
              handleFilesSelected(files, true);
            } else {
              alert("You can only upload one cover image.");
            }
          }}
        />
        {uploadedFiles.coverImageLoading && (
          <div className="mt-2 text-sm text-blue-600">
            Uploading... {uploadedFiles.uploadProgress}%
          </div>
        )}
      </>
    ) : (
      <div className="border p-4 rounded-lg bg-gray-100">
        <p className="text-sm text-gray-500">Cover image selected.</p>
        <img
          src={uploadedFiles.coverImage}
          alt="Cover"
          className="mt-2 w-32 h-32 object-cover"
        />
        <button
          onClick={() => setUploadedFiles((prev) => ({ ...prev, coverImage: "" }))}
          className="mt-2 text-sm text-red-600 hover:underline"
        >
          Remove Image
        </button>
      </div>
    )}
  </CardContent>
</Card>


            {/* Property Images & Videos */}
           
            <Card>
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold text-[#1C4532] mb-4">Property Images & Videos</h3>
    
    {/* Upload Zone */}
    <FileUploadZone onFilesSelected={(files) => handleFilesSelected(files, false)} />

    {/* Upload Progress */}
    {uploadedFiles.otherMediaLoading && (
      <div className="mt-4 flex items-center space-x-2 text-blue-600">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Uploading... {uploadedFiles.uploadProgress}%</span>
      </div>
    )}

    {/* Media Grid */}
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {uploadedFiles.otherMedia.map((url, idx) => (
        <div key={idx} className="relative group border rounded-lg overflow-hidden shadow-md">
          {url.endsWith(".mp4") ? (
            <video src={url} controls className="w-full h-32 object-cover" />
          ) : (
            <img src={url} alt={`Media ${idx}`} className="w-full h-32 object-cover" />
          )}

          {/* Overlay with Remove Button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity">
            <button
              onClick={() =>
                setUploadedFiles((prev) => ({
                  ...prev,
                  otherMedia: prev.otherMedia.filter((_, i) => i !== idx),
                }))
              }
              className="hidden group-hover:block bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

            <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="bg-[#1C4532] hover:bg-[#153726]"
          disabled={isSubmitting} // Disable during loading
        >
          {isSubmitting ? 'Uploading...' : 'Upload Property'} {/* Show loading state */}
        </Button>
      </div>
          </form>

          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false);
              router.push('/rentershub/properties');
            }}
          />
        </div>
      </div>
   
  );
}
