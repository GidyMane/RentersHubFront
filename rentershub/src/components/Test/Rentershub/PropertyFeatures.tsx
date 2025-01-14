'use client'

import { Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const FEATURES = [
  'Water 24/7',
  'Electricity',
  'Security Guard',
  'CCTV Surveillance',
  'Parking Space',
  'Borehole Water',
  'Generator Backup',
  'Children Play Area',
  'Gym',
  'Swimming Pool',
  'Elevator',
  'Balcony',
  'Furnished',
  'Semi-furnished',
  'Unfurnished',
  'Fiber Internet',
  'DStv Connection',
  'Solar Water Heating',
  'Perimeter Wall',
  'Electric Fence'
]

interface PropertyFeaturesProps {
  selectedFeatures: string[]
  onFeatureToggle: (feature: string) => void
}

export function PropertyFeatures({ selectedFeatures, onFeatureToggle }: PropertyFeaturesProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center space-x-2">
            <Checkbox
              id={feature}
              checked={selectedFeatures.includes(feature)}
              onCheckedChange={() => onFeatureToggle(feature)}
            />
            <label
              htmlFor={feature}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {feature}
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

