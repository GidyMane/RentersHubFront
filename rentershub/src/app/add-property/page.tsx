'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/Test/Rentershub/DashbordLayout'
import { FileUploadZone } from '@/components/Test/Rentershub/FileUploadZone'
import { PropertyFeatures } from '@/components/Test/Rentershub/PropertyFeatures'
import { SuccessModal } from '@/components/Test/Rentershub/SuccessModal'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const HOUSE_TYPES = [
  'Bedsitters',
  'One Bedroom apartments',
  'Two Bedroom apartments',
  'Three Bedroom apartments',
  'Four Bedroom apartments',
  'Five Bedroom apartments',
  '2BR Own Compound',
  '3BR Own Compound',
  '4BR Own Compound',
  '5+BR Own Compound',
  'Singles',
  'Doubles',
  'Shops',
  'Offices'
]

const COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  // Add all 47 counties
]

export default function AddPropertyPage() {
  const router = useRouter()
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setIsSuccessModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C4532] mb-6">
            Add New Property
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Post Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., TWO BEDROOM APARTMENTS TO LET IN KARATINA TOWN"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="houseType">House Type</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select house type" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOUSE_TYPES.map(type => (
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
                            {COUNTIES.map(county => (
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
                  </div>

                  {/* Management Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="managedBy">Managed By</Label>
                      <Input
                        id="managedBy"
                        placeholder="Landlord's name or Agency's name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254"
                        required
                      />
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rent">Rent (per month)</Label>
                      <Input
                        id="rent"
                        type="number"
                        placeholder="KES"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="deposit">Deposit</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="KES"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="garbage">Garbage Fees</Label>
                      <Input
                        id="garbage"
                        type="number"
                        placeholder="KES"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="security">Security Fees</Label>
                      <Input
                        id="security"
                        type="number"
                        placeholder="KES"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="water">Water Charges</Label>
                      <Input
                        id="water"
                        type="number"
                        placeholder="KES per unit/PM"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="waterDeposit">Water Deposit</Label>
                      <Input
                        id="waterDeposit"
                        type="number"
                        placeholder="KES"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otherFees">Other Fees</Label>
                    <Input
                      id="otherFees"
                      placeholder="Specify any other fees"
                    />
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#1C4532] mb-4">
                  Property Features
                </h3>
                <PropertyFeatures
                  selectedFeatures={selectedFeatures}
                  onFeatureToggle={handleFeatureToggle}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#1C4532] mb-4">
                  Property Images
                </h3>
                <FileUploadZone
                  onFilesSelected={(files) => setUploadedFiles(prev => [...prev, ...files])}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-[#1C4532] hover:bg-[#153726]"
              >
                Upload Property
              </Button>
            </div>
          </form>

          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => {
              setIsSuccessModalOpen(false)
              router.push('/properties')
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

