'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/Test/Rentershub/DashbordLayout'
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
import { baseUrl } from '@/utils/constants'

export default function AddPropertyPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [houseTypes, setHouseTypes] = useState<string[]>([])
  // const [counties, setCounties] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  // const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa", 
    "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", 
    "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", 
    "Makueni", "Mandera", "Meru", "Migori", "Marsabit", "Mombasa", "Murang'a", 
    "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", 
    "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", 
    "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ]

  useEffect(() => {
    if (!session?.user.accessToken) {
      console.error('Session is not available.')
      return
    }

    const fetchHouseTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}listing/propertytype`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

        if (!response.ok) {
          const errorDetails = await response.text()
          throw new Error(`Failed to fetch house types: ${response.status}, ${errorDetails}`)
        }

        const data = await response.json()
        setHouseTypes(data.results.map((type: { name: string }) => type.name))
      } catch (error) {
        console.error('Error fetching house types:', error)
      }
    }

   

    fetchHouseTypes()
    
  }, [session?.user.accessToken])

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
                            {houseTypes.map(type => (
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
              {/* <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#1C4532] mb-4">
                  Property Images
                </h3>
                <FileUploadZone
                  onFilesSelected={(files) => setUploadedFiles(prev => [...prev, ...files])}
                />
              </CardContent> */}
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
