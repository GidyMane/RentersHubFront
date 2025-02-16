import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useSession } from 'next-auth/react'
import { baseUrl } from '@/utils/constants'

interface PropertyFeaturesProps {
  selectedFeatures: number[] // IDs of selected features
  onFeatureToggle: (featureId: number) => void
}

interface Feature {
  id: number
  name: string
  propertytype: number
}

export function PropertyFeatures({ selectedFeatures, onFeatureToggle }: PropertyFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!session?.user?.accessToken) {
        console.warn('Session is not available or access token is missing.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${baseUrl}listing/propertyfeature?limit=62&offset=0`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        setFeatures(data.results)
      } catch (error) {
        console.error('An error occurred while fetching features:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [session?.user?.accessToken])

  if (loading) {
    return <p>Loading features...</p>
  }

  if (!session?.user?.accessToken) {
    return <p>You need to log in to view the property features.</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${feature.id}`}
              checked={selectedFeatures.includes(feature.id)}
              onCheckedChange={() => onFeatureToggle(feature.id)} // Use ID for toggling
            />
            <label
              htmlFor={`${feature.id}`}
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
          {features
            .filter((feature) => selectedFeatures.includes(feature.id))
            .map((feature) => (
              <p key={feature.id} className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 mr-2 text-[#1C4532]" />
                {feature.name}
              </p>
            ))}
        </div>
      )}
    </div>
  )
}
