'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useSession } from 'next-auth/react'
import { baseUrl } from '@/utils/constants'

interface PropertyFeaturesProps {
  selectedFeatures: string[]
  onFeatureToggle: (feature: string) => void
}

interface Feature {
  id: number
  name: string
  propertytype: number
}

export function PropertyFeatures({ selectedFeatures, onFeatureToggle }: PropertyFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchFeatures = async () => {
      // Check session status before proceeding
      if (!session?.user?.accessToken) {
        console.warn('Session is not available or access token is missing.')
        setLoading(false)
        return
      }

      console.info('Session is available. Proceeding to fetch features.')

      try {
        console.log('Fetching features from API:', `${baseUrl}listing/propertyfeature`)
        const response = await fetch(`${baseUrl}listing/propertyfeature`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

        console.log('API Response:', response)

        if (!response.ok) {
          const errorDetails = await response.text() // Get the response body
          console.error(`Error fetching features: Status ${response.status}, Response: ${errorDetails}`)
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        console.info('Features fetched successfully:', data)
        setFeatures(data.results)
      } catch (error) {
        console.error('An error occurred while fetching features:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack available',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [session?.user?.accessToken])

  if (loading) {
    console.log('Loading state active. Features are still being fetched.')
    return <p>Loading features...</p>
  }

  if (!session?.user?.accessToken) {
    console.warn('Session is not available or user is not authenticated.')
    return <p>You need to log in to view the property features.</p>
  }

  console.log('Rendering PropertyFeatures component with fetched data.')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox
              id={feature.name}
              checked={selectedFeatures.includes(feature.name)}
              onCheckedChange={() => onFeatureToggle(feature.name)}
            />
            <label
              htmlFor={feature.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {feature.name}
            </label>
          </div>
        ))}
      </div>

      {selectedFeatures.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-[#1C4532]">Selected Features:</h4>
          {selectedFeatures.map((feature) => (
            <p key={feature} className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 mr-2 text-[#1C4532]" />
              {feature}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
