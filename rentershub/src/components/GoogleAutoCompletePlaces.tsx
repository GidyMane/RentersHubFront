"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

interface PlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export function PlacesAutocomplete() {
  const [input, setInput] = useState("")
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<PlacePrediction | null>(null)
  const debouncedInput = useDebounce(input, 300)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initAutocompleteService
      document.head.appendChild(script)
    } else {
      initAutocompleteService()
    }

    return () => {
      autocompleteService.current = null
    }
  }, [])

  useEffect(() => {
    if (debouncedInput && autocompleteService.current && !selectedPrediction) {
      setIsLoading(true)
      autocompleteService.current.getPlacePredictions(
        { 
          input: debouncedInput, 
          componentRestrictions: { country: "KE" } // Restrict to Kenya
        }, 
        (results, status) => {
          setIsLoading(false)
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results)
          } else {
            setPredictions([])
          }
        }
      )
    } else {
      setPredictions([])
    }
  }, [debouncedInput, selectedPrediction])

  function initAutocompleteService() {
    if (window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
    setSelectedPrediction(null) // Allows suggestions to reappear if user types again
  }

  function handlePredictionClick(prediction: PlacePrediction) {
    setInput(prediction.description)
    setPredictions([]) // Hide suggestions after selecting
    setSelectedPrediction(prediction) // Mark as selected
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Input
          type="text"
          placeholder="e.g., Westlands, Nairobi"
          name="address"
          value={input}
          onChange={handleInputChange}
          className="pr-10 border-primary focus:border-secondary ring-primary"
        />
        <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>
      {isLoading && (
        <Button disabled className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      )}
      {predictions.length > 0 && !selectedPrediction && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100"
              onClick={() => handlePredictionClick(prediction)}
            >
              <span>{prediction.structured_formatting.main_text}</span>
              <span className="text-gray-500 text-sm"> {prediction.structured_formatting.secondary_text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
