'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Meru', 'Migori', 'Marsabit', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
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
        console.log(response, "house features")

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

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with uploaded files:', uploadedFiles);
    setIsSuccessModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">
            Add New Property
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" placeholder="e.g., TWO BEDROOM APARTMENTS TO LET IN KARATINA TOWN" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="houseType">House Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select house type" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="county">County</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTIES.map((county) => (
                          <SelectItem key={county} value={county.toLowerCase()}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Kabiria, Dagoretti near Fremo Hospital"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="managedBy">Managed By</Label>
                    <Input id="managedBy" placeholder="Landlord's name or Agency's name" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+254" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rent">Rent Price Per Month</Label>
                    <Input id="rent" placeholder="e.g., 15,000" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="deposit">Deposit Amount</Label>
                    <Input id="deposit" placeholder="e.g., 10,000" type="number" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="garbageFees">Garbage Fees</Label>
                    <Input id="garbageFees" placeholder="e.g., 500" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="securityFees">Security Fees</Label>
                    <Input id="securityFees" placeholder="e.g., 1,000" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="waterCharges">Water Charges/Unit/PM</Label>
                    <Input id="waterCharges" placeholder="e.g., 200" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="waterDeposit">Water Deposit</Label>
                    <Input id="waterDeposit" placeholder="e.g., 2,000" type="number" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="otherFees">Specify Other Fees</Label>
                  <Input id="otherFees" placeholder="Other fees..." />
                </div>

                <div>
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Write something about the vacant house..."
                    className="h-32"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#1C4532] mb-4">Property Features</h3>
                <PropertyFeatures
                  selectedFeatures={selectedFeatures}
                  onFeatureToggle={handleFeatureToggle}
                />
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
              <Button type="submit" size="lg" className="bg-[#1C4532] hover:bg-[#153726]">
                Upload Property
              </Button>
            </div>
          </form>

          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false);
              router.push('/properties');
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
