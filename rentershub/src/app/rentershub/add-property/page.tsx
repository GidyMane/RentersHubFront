'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function AddPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const [houseTypes, setHouseTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    coverImage?: string;
    otherMedia: string[];
  }>({
    otherMedia: [],
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
        setHouseTypes(data.results.map((type: { name: string }) => type.name));
      } catch (error) {
        console.error('Error fetching house types:', error);
      }
    };

    fetchHouseTypes();
  }, [session?.user.accessToken]);

  const handleFilesSelected = async (files: File[], isCoverImage: boolean) => {
    const validTypes = isCoverImage
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/webm'];

    const validFiles = files.filter((file) => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Some files have invalid types and will not be uploaded.');
    }

    const uploadedUrls: string[] = [];
    for (const file of validFiles) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            console.log(`Uploading ${file.name}: ${progress}%`);
          },
        });
        uploadedUrls.push(res.url);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }

    if (isCoverImage) {
      setUploadedFiles((prev) => ({ ...prev, coverImage: uploadedUrls[0] }));
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        otherMedia: [...prev.otherMedia, ...uploadedUrls],
      }));
    }
  };

  type FeatureId = number
  
  const formik = useFormik({
    initialValues: {
      title: '',
      features: [] as FeatureId[],
      houseType: '',
      county: '',
      city:'',
      poBox:'',
      location: '',
      managedBy: '',
      phone: '',
      rent: '',
      deposit: '',
      garbageFees: '',
      securityFees: '',
      waterCharges: '',
      waterDeposit: '',
      otherFees: '',
      description: '',
      
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      houseType: Yup.string().required('House type is required'),
      county: Yup.string().required('County is required'),      
      managedBy: Yup.string().required('Manager is required'),
      phone: Yup.string().required('Phone number is required'),
      rent: Yup.number()
        .required('Rent price is required')
        .positive('Rent must be a positive value'),
      deposit: Yup.number()
        .required('Deposit amount is required')
        .positive('Deposit must be a positive value'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formattedData = {
          title: values.title,
          description: values.description,
          property_type: parseInt(values.houseType, 10),
          price: '0',
          city: values.city || 'Unknown City',
          state: values.county,          
          country: 'Kenya',
          postal_code: values.poBox || '00000',          
          address: values.location,
          features: values.features,
          amenities:[],
          water_charges: parseFloat(values.waterCharges || '0'), // Ensuring type consistency
          garbage_charges: parseFloat(values.garbageFees || '0'), // Consistently parse to float
          security_charges: parseFloat(values.securityFees || '0'),
          other_charges: parseFloat(values.otherFees || '0'),
          water_deposit: parseFloat(values.waterDeposit || '0'),
          is_available: true,
          is_approved: true,
          featured: true,
          rent_price: parseFloat(values.rent),
          deposit_amount: parseFloat(values.deposit),
          main_image_url: uploadedFiles?.coverImage
            ? { id: 'main-image', url: uploadedFiles.coverImage }
            : null,
          other_images: (uploadedFiles?.otherMedia || []).map((url, idx) => ({
            id: `img-${idx + 1}`,
            url,
          })),
          posted_by: session?.user?.user_id,
          managed_by: values.managedBy,
        };

       console.log(formattedData, "formatted data")

        const response = await fetch(`${baseUrl}listing/property`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(formattedData),
        });

        console.log(response,"this is a response from post")
  
        if (!response.ok) {
          const errorDetails = await response.text();
         
          throw new Error(
            `Failed to create property: ${response.status}, ${errorDetails}`
          );
        }
  
        const responseData = await response.json();
        toast.success('Property created successfully:', responseData);
  
        setIsSuccessModalOpen(true);
        setIsSubmitting(false); // End loading
        router.push('/rentershub/properties'); // Redirect after success
      }       
      catch (error) {
        toast.error('Error submitting property',);
        alert('Failed to submit property. Please try again.');
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
    <DashboardLayout>
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
                      onValueChange={(value) => formik.setFieldValue('houseType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select house type" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.houseType && formik.errors.houseType && (
                      <p className="text-red-500 text-sm">{formik.errors.houseType}</p>
                    )}
                  </div>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Kabiria, Dagoretti near Fremo Hospital"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
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
                  placeholder="+254"
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
    
    {/* Conditionally render FileUploadZone based on whether the cover image is already selected */}
    {!uploadedFiles.coverImage ? (
      <FileUploadZone
        onFilesSelected={(files) => {
          // Allow only one file to be uploaded
          if (files.length === 1) {
            handleFilesSelected(files, true);
          } else {
            alert("You can only upload one cover image.");
          }
        }}
      />
    ) : (
      <div className="border p-4 rounded-lg bg-gray-100">
        <p className="text-sm text-gray-500">Cover image selected.</p>
        <img
          src={uploadedFiles.coverImage}
          alt="Cover"
          className="mt-2 w-32 h-32 object-cover"
        />
        
        {/* Allow the user to remove the image and upload a new one */}
        <button
          onClick={() => {
            setUploadedFiles(prev => ({
              ...prev,
              coverImage: ''
            }));
          }}
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
                <FileUploadZone onFilesSelected={(files) => handleFilesSelected(files, false)} />
                {uploadedFiles.otherMedia.map((url, idx) => (
                  <div key={idx}>
                    {url.endsWith('.mp4') ? (
                      <video src={url} controls className="w-32 h-32" />
                    ) : (
                      <img src={url} alt={`Media ${idx}`} className="w-32 h-32" />
                    )}
                  </div>
                ))}
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
    </DashboardLayout>
  );
}
